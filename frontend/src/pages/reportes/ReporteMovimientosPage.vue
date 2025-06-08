<template>
  <div class="reporte-page">
    <div class="container-xl">
      <div class="page-header d-print-none">
        <div class="row align-items-center">
          <div class="col">
            <h2 class="page-title">Reporte de Movimientos</h2>
          </div>
          <div class="col-auto ms-auto">
            <button class="btn btn-primary" @click="exportarReporte">
              <i class="fas fa-download me-2"></i>Exportar
            </button>
          </div>
        </div>
      </div>

      <div class="page-body">
        <div class="card">
          <div class="card-body">
            <!-- Filtros -->
            <div class="row mb-4">
              <div class="col-md-3">
                <label class="form-label">Fecha Inicio</label>
                <input 
                  type="date" 
                  class="form-control" 
                  v-model="filtros.fechaInicio"
                >
              </div>
              <div class="col-md-3">
                <label class="form-label">Fecha Fin</label>
                <input 
                  type="date" 
                  class="form-control" 
                  v-model="filtros.fechaFin"
                >
              </div>
              <div class="col-md-3">
                <label class="form-label">Bodega</label>
                <select v-model="filtros.bodega" class="form-select">
                  <option value="">Todas</option>
                  <option v-for="bodega in bodegas" :key="bodega.id" :value="bodega.id">
                    {{ bodega.nombre }}
                  </option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Producto</label>
                <select v-model="filtros.producto" class="form-select">
                  <option value="">Todos</option>
                  <option v-for="producto in productos" :key="producto.id" :value="producto.id">
                    {{ producto.nombre }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Tabla de Movimientos -->
            <div class="table-responsive">
              <table class="table table-vcenter">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Producto</th>
                    <th>Origen</th>
                    <th>Destino</th>
                    <th>Cantidad</th>
                    <th>Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="movimiento in movimientosFiltrados" :key="movimiento.id">
                    <td>{{ formatDate(movimiento.fecha) }}</td>
                    <td>{{ getProductoNombre(movimiento.producto_id) }}</td>
                    <td>{{ getBodegaNombre(movimiento.origen_id) }}</td>
                    <td>{{ getBodegaNombre(movimiento.destino_id) }}</td>
                    <td>{{ movimiento.cantidad }}</td>
                    <td>{{ getUsuarioNombre(movimiento.usuario_id) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Resumen -->
            <div class="row mt-4">
              <div class="col-md-4">
                <div class="card">
                  <div class="card-body">
                    <h3 class="card-title">Total Movimientos</h3>
                    <p class="display-6">{{ movimientosFiltrados.length }}</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card">
                  <div class="card-body">
                    <h3 class="card-title">Productos Movidos</h3>
                    <p class="display-6">{{ productosUnicos.length }}</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card">
                  <div class="card-body">
                    <h3 class="card-title">Cantidad Total</h3>
                    <p class="display-6">{{ cantidadTotal }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useProductStore } from '../../stores/productStore'
import { useInventoryMovementStore } from '../../stores/inventoryMovementStore'
import { useUserStore } from '../../stores/userStore'

export default {
  name: 'ReporteMovimientosPage',
  
  setup() {
    const productStore = useProductStore()
    const movementStore = useInventoryMovementStore()
    const userStore = useUserStore()

    const filtros = ref({
      fechaInicio: '',
      fechaFin: '',
      bodega: '',
      producto: ''
    })

    // Mock data para bodegas (debería venir de un store)
    const bodegas = ref([
      { id: 1, nombre: 'Bodega Principal' },
      { id: 2, nombre: 'Bodega Secundaria' },
      { id: 3, nombre: 'Bodega Auxiliar' }
    ])

    const productos = computed(() => productStore.products)

    const movimientosFiltrados = computed(() => {
      let resultado = [...movementStore.movements]

      // Filtrar por fecha
      if (filtros.value.fechaInicio) {
        resultado = resultado.filter(m => 
          new Date(m.fecha) >= new Date(filtros.value.fechaInicio)
        )
      }
      if (filtros.value.fechaFin) {
        resultado = resultado.filter(m => 
          new Date(m.fecha) <= new Date(filtros.value.fechaFin)
        )
      }

      // Filtrar por bodega
      if (filtros.value.bodega) {
        resultado = resultado.filter(m => 
          m.origen_id === filtros.value.bodega || 
          m.destino_id === filtros.value.bodega
        )
      }

      // Filtrar por producto
      if (filtros.value.producto) {
        resultado = resultado.filter(m => m.producto_id === filtros.value.producto)
      }

      // Ordenar por fecha descendente
      return resultado.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    })

    const productosUnicos = computed(() => {
      const ids = new Set(movimientosFiltrados.value.map(m => m.producto_id))
      return Array.from(ids)
    })

    const cantidadTotal = computed(() => {
      return movimientosFiltrados.value.reduce((sum, m) => sum + m.cantidad, 0)
    })

    const getProductoNombre = (id) => {
      const producto = productos.value.find(p => p.id === id)
      return producto ? producto.nombre : 'Producto no encontrado'
    }

    const getBodegaNombre = (id) => {
      const bodega = bodegas.value.find(b => b.id === id)
      return bodega ? bodega.nombre : 'Bodega no encontrada'
    }

    const getUsuarioNombre = (id) => {
      // Aquí deberías obtener el nombre del usuario del userStore
      return 'Usuario ' + id
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const exportarReporte = () => {
      // Aquí iría la lógica para exportar el reporte
      alert('Exportando reporte...')
    }

    return {
      filtros,
      bodegas,
      productos,
      movimientosFiltrados,
      productosUnicos,
      cantidadTotal,
      getProductoNombre,
      getBodegaNombre,
      getUsuarioNombre,
      formatDate,
      exportarReporte
    }
  }
}
</script>

<style scoped>
.reporte-page {
  padding: 1rem;
}

.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table th {
  font-weight: 600;
  color: #4a5568;
}

.display-6 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.card-title {
  color: #4a5568;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style> 
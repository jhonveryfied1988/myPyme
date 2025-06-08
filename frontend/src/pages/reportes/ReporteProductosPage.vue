<template>
  <div class="reporte-page">
    <div class="container-xl">
      <div class="page-header d-print-none">
        <div class="row align-items-center">
          <div class="col">
            <h2 class="page-title">Reporte de Productos</h2>
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
                <label class="form-label">Categoría</label>
                <select v-model="filtros.categoria" class="form-select">
                  <option value="">Todas</option>
                  <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
                    {{ cat.nombre }}
                  </option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Stock</label>
                <select v-model="filtros.stock" class="form-select">
                  <option value="">Todos</option>
                  <option value="bajo">Bajo Stock</option>
                  <option value="normal">Stock Normal</option>
                  <option value="alto">Stock Alto</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Ordenar por</label>
                <select v-model="filtros.ordenar" class="form-select">
                  <option value="nombre">Nombre</option>
                  <option value="stock">Stock</option>
                  <option value="precio">Precio</option>
                </select>
              </div>
            </div>

            <!-- Tabla de Productos -->
            <div class="table-responsive">
              <table class="table table-vcenter">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Stock</th>
                    <th>Stock Mínimo</th>
                    <th>Precio</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="producto in productosFiltrados" :key="producto.id">
                    <td>{{ producto.nombre }}</td>
                    <td>{{ getCategoryName(producto.categoria_id) }}</td>
                    <td>{{ producto.stock }}</td>
                    <td>{{ producto.stock_minimo }}</td>
                    <td>{{ formatPrice(producto.precio) }}</td>
                    <td>
                      <span 
                        class="badge"
                        :class="getStockStatusClass(producto)"
                      >
                        {{ getStockStatus(producto) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Resumen -->
            <div class="row mt-4">
              <div class="col-md-4">
                <div class="card">
                  <div class="card-body">
                    <h3 class="card-title">Total Productos</h3>
                    <p class="display-6">{{ productosFiltrados.length }}</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card">
                  <div class="card-body">
                    <h3 class="card-title">Valor Total</h3>
                    <p class="display-6">{{ formatPrice(valorTotal) }}</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card">
                  <div class="card-body">
                    <h3 class="card-title">Productos Bajo Stock</h3>
                    <p class="display-6">{{ productosBajoStock }}</p>
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

export default {
  name: 'ReporteProductosPage',
  
  setup() {
    const productStore = useProductStore()
    const filtros = ref({
      categoria: '',
      stock: '',
      ordenar: 'nombre'
    })

    // Mock data para categorías (debería venir de un store)
    const categorias = ref([
      { id: 1, nombre: 'Electrónicos' },
      { id: 2, nombre: 'Ropa' },
      { id: 3, nombre: 'Alimentos' }
    ])

    const productosFiltrados = computed(() => {
      let resultado = [...productStore.products]

      // Filtrar por categoría
      if (filtros.value.categoria) {
        resultado = resultado.filter(p => p.categoria_id === filtros.value.categoria)
      }

      // Filtrar por estado de stock
      if (filtros.value.stock) {
        switch (filtros.value.stock) {
          case 'bajo':
            resultado = resultado.filter(p => p.stock < p.stock_minimo)
            break
          case 'normal':
            resultado = resultado.filter(p => p.stock >= p.stock_minimo && p.stock <= p.stock_minimo * 2)
            break
          case 'alto':
            resultado = resultado.filter(p => p.stock > p.stock_minimo * 2)
            break
        }
      }

      // Ordenar
      resultado.sort((a, b) => {
        switch (filtros.value.ordenar) {
          case 'nombre':
            return a.nombre.localeCompare(b.nombre)
          case 'stock':
            return b.stock - a.stock
          case 'precio':
            return b.precio - a.precio
          default:
            return 0
        }
      })

      return resultado
    })

    const valorTotal = computed(() => {
      return productosFiltrados.value.reduce((sum, p) => sum + (p.precio * p.stock), 0)
    })

    const productosBajoStock = computed(() => {
      return productosFiltrados.value.filter(p => p.stock < p.stock_minimo).length
    })

    const getCategoryName = (id) => {
      const categoria = categorias.value.find(c => c.id === id)
      return categoria ? categoria.nombre : 'Sin categoría'
    }

    const getStockStatus = (producto) => {
      if (producto.stock < producto.stock_minimo) return 'Bajo'
      if (producto.stock <= producto.stock_minimo * 2) return 'Normal'
      return 'Alto'
    }

    const getStockStatusClass = (producto) => {
      if (producto.stock < producto.stock_minimo) return 'bg-danger'
      if (producto.stock <= producto.stock_minimo * 2) return 'bg-warning'
      return 'bg-success'
    }

    const formatPrice = (price) => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
      }).format(price)
    }

    const exportarReporte = () => {
      // Aquí iría la lógica para exportar el reporte
      alert('Exportando reporte...')
    }

    return {
      filtros,
      categorias,
      productosFiltrados,
      valorTotal,
      productosBajoStock,
      getCategoryName,
      getStockStatus,
      getStockStatusClass,
      formatPrice,
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

.badge {
  padding: 0.5em 1em;
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
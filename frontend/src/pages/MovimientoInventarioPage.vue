<template>
  <div class="movimiento-inventario-page">
    <div class="container-xl">
      <div class="page-header d-print-none">
        <div class="row align-items-center">
          <div class="col">
            <h2 class="page-title">Movimiento de Inventario</h2>
          </div>
        </div>
      </div>

      <div class="page-body">
        <div class="row">
          <!-- Formulario de Movimiento -->
          <div class="col-md-8">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Registrar Movimiento</h3>
              </div>
              <div class="card-body">
                <form @submit.prevent="registrarMovimiento">
                  <!-- Producto -->
                  <div class="mb-3">
                    <label class="form-label required">Producto</label>
                    <select 
                      class="form-select" 
                      v-model="formData.producto_id"
                      required
                      @change="cargarStockProducto"
                    >
                      <option value="">Seleccione un producto</option>
                      <option 
                        v-for="producto in productos" 
                        :key="producto.id" 
                        :value="producto.id"
                      >
                        {{ producto.nombre }}
                      </option>
                    </select>
                  </div>

                  <!-- Bodega Origen -->
                  <div class="mb-3">
                    <label class="form-label required">Bodega Origen</label>
                    <select 
                      class="form-select" 
                      v-model="formData.origen_id"
                      required
                      @change="actualizarStockDisponible"
                    >
                      <option value="">Seleccione bodega origen</option>
                      <option 
                        v-for="bodega in bodegas" 
                        :key="bodega.id" 
                        :value="bodega.id"
                      >
                        {{ bodega.nombre }}
                      </option>
                    </select>
                  </div>

                  <!-- Stock Disponible -->
                  <div class="mb-3" v-if="stockDisponible !== null">
                    <div class="alert alert-info">
                      Stock disponible en bodega origen: {{ stockDisponible }}
                    </div>
                  </div>

                  <!-- Bodega Destino -->
                  <div class="mb-3">
                    <label class="form-label required">Bodega Destino</label>
                    <select 
                      class="form-select" 
                      v-model="formData.destino_id"
                      required
                    >
                      <option value="">Seleccione bodega destino</option>
                      <option 
                        v-for="bodega in bodegasDestino" 
                        :key="bodega.id" 
                        :value="bodega.id"
                      >
                        {{ bodega.nombre }}
                      </option>
                    </select>
                  </div>

                  <!-- Cantidad -->
                  <div class="mb-3">
                    <label class="form-label required">Cantidad</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      v-model.number="formData.cantidad"
                      required
                      min="1"
                      :max="stockDisponible"
                    >
                  </div>

                  <!-- Notas -->
                  <div class="mb-3">
                    <label class="form-label">Notas</label>
                    <textarea 
                      class="form-control" 
                      v-model="formData.notas"
                      rows="3"
                    ></textarea>
                  </div>

                  <div class="form-footer">
                    <button 
                      type="submit" 
                      class="btn btn-primary"
                      :disabled="!isFormValid || loading"
                    >
                      <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                      Registrar Movimiento
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Últimos Movimientos -->
          <div class="col-md-4">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Últimos Movimientos</h3>
              </div>
              <div class="card-body">
                <div v-if="ultimosMovimientos.length === 0" class="text-center text-muted py-3">
                  No hay movimientos registrados
                </div>
                <div v-else class="list-group list-group-flush">
                  <div 
                    v-for="movimiento in ultimosMovimientos" 
                    :key="movimiento.id"
                    class="list-group-item"
                  >
                    <div class="d-flex align-items-center">
                      <div class="flex-grow-1">
                        <div class="font-weight-bold">
                          {{ getProductoNombre(movimiento.producto_id) }}
                        </div>
                        <small class="text-muted">
                          {{ getBodegaNombre(movimiento.origen_id) }} → 
                          {{ getBodegaNombre(movimiento.destino_id) }}
                        </small>
                        <div class="small text-muted">
                          Cantidad: {{ movimiento.cantidad }}
                        </div>
                      </div>
                      <div class="text-muted small">
                        {{ formatDate(movimiento.fecha) }}
                      </div>
                    </div>
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
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '../stores/productStore'
import { useInventoryMovementStore } from '../stores/inventoryMovementStore'

export default {
  name: 'MovimientoInventarioPage',
  
  setup() {
    const productStore = useProductStore()
    const movementStore = useInventoryMovementStore()
    const loading = ref(false)
    const stockDisponible = ref(null)

    const formData = ref({
      producto_id: '',
      origen_id: '',
      destino_id: '',
      cantidad: null,
      notas: ''
    })

    // Datos mock para bodegas (deberían venir de un store)
    const bodegas = ref([
      { id: 1, nombre: 'Bodega Principal' },
      { id: 2, nombre: 'Bodega Secundaria' },
      { id: 3, nombre: 'Bodega Auxiliar' }
    ])

    const productos = computed(() => productStore.products)
    const ultimosMovimientos = computed(() => {
      return movementStore.movements.slice().reverse().slice(0, 5)
    })

    const bodegasDestino = computed(() => {
      return bodegas.value.filter(b => b.id !== formData.value.origen_id)
    })

    const isFormValid = computed(() => {
      return formData.value.producto_id &&
             formData.value.origen_id &&
             formData.value.destino_id &&
             formData.value.cantidad > 0 &&
             formData.value.cantidad <= stockDisponible.value
    })

    const cargarStockProducto = async () => {
      if (formData.value.producto_id && formData.value.origen_id) {
        // Aquí deberías obtener el stock real del producto en la bodega
        stockDisponible.value = 100 // Mock value
      }
    }

    const actualizarStockDisponible = () => {
      if (formData.value.producto_id) {
        cargarStockProducto()
      }
    }

    const registrarMovimiento = async () => {
      try {
        loading.value = true
        await movementStore.moveProduct({
          productId: formData.value.producto_id,
          sourceWarehouseId: formData.value.origen_id,
          targetWarehouseId: formData.value.destino_id,
          quantity: formData.value.cantidad,
          notes: formData.value.notas
        })

        // Resetear formulario
        formData.value = {
          producto_id: '',
          origen_id: '',
          destino_id: '',
          cantidad: null,
          notas: ''
        }
        stockDisponible.value = null

        alert('Movimiento registrado correctamente')
      } catch (error) {
        alert('Error al registrar el movimiento')
      } finally {
        loading.value = false
      }
    }

    const getProductoNombre = (id) => {
      const producto = productos.value.find(p => p.id === id)
      return producto ? producto.nombre : 'Producto no encontrado'
    }

    const getBodegaNombre = (id) => {
      const bodega = bodegas.value.find(b => b.id === id)
      return bodega ? bodega.nombre : 'Bodega no encontrada'
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    onMounted(async () => {
      if (!productos.value.length) {
        await productStore.fetchProducts()
      }
    })

    return {
      formData,
      loading,
      productos,
      bodegas,
      bodegasDestino,
      stockDisponible,
      ultimosMovimientos,
      isFormValid,
      registrarMovimiento,
      cargarStockProducto,
      actualizarStockDisponible,
      getProductoNombre,
      getBodegaNombre,
      formatDate
    }
  }
}
</script>

<style scoped>
.movimiento-inventario-page {
  padding: 1rem;
}

.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-footer {
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.list-group-item {
  padding: 1rem;
}

.required:after {
  content: " *";
  color: red;
}
</style> 
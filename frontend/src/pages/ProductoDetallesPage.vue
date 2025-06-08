<template>
  <div class="producto-detalles">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>
        <i class="fas fa-box me-2"></i>
        Detalles del Producto
      </h1>
      <router-link to="/productos" class="btn btn-secondary">
        <i class="fas fa-arrow-left me-2"></i>
        Volver
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      <i class="fas fa-exclamation-triangle me-2"></i>
      {{ error }}
    </div>

    <div v-else-if="producto" class="row">
      <!-- Información Principal -->
      <div class="col-md-8">
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title border-bottom pb-2">Información General</h5>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="text-muted">Código:</label>
                  <p class="h5"><code>{{ producto.codigo }}</code></p>
                </div>
                <div class="mb-3">
                  <label class="text-muted">Nombre:</label>
                  <p class="h5">{{ producto.nombre }}</p>
                </div>
                <div class="mb-3">
                  <label class="text-muted">Categoría:</label>
                  <p class="h5">{{ getCategoriaName(producto.categoria_id) }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="text-muted">Stock Actual:</label>
                  <p class="h5">
                    {{ producto.stock }}
                    <span 
                      class="badge ms-2"
                      :class="{
                        'bg-success': producto.stock > producto.stock_minimo,
                        'bg-warning': producto.stock === producto.stock_minimo,
                        'bg-danger': producto.stock < producto.stock_minimo
                      }"
                    >
                      {{ getEstadoStock(producto) }}
                    </span>
                  </p>
                </div>
                <div class="mb-3">
                  <label class="text-muted">Stock Mínimo:</label>
                  <p class="h5">{{ producto.stock_minimo }}</p>
                </div>
                <div class="mb-3">
                  <label class="text-muted">Última Actualización:</label>
                  <p class="h5">{{ formatDate(producto.updated_at) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Descripción -->
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title border-bottom pb-2">Descripción</h5>
            <p class="card-text">{{ producto.descripcion || 'Sin descripción disponible' }}</p>
          </div>
        </div>
      </div>

      <!-- Ubicaciones en Bodegas -->
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title border-bottom pb-2">
              <i class="fas fa-warehouse me-2"></i>
              Ubicaciones
            </h5>
            <div v-if="ubicaciones.length === 0" class="text-center py-3">
              <p class="text-muted">No hay ubicaciones registradas</p>
            </div>
            <ul v-else class="list-group list-group-flush">
              <li 
                v-for="ubicacion in ubicaciones" 
                :key="ubicacion.id"
                class="list-group-item"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="mb-0">{{ ubicacion.nombre }}</h6>
                  </div>
                  <span class="badge bg-primary rounded-pill">
                    {{ ubicacion.cantidad }}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-info" role="alert">
      <i class="fas fa-info-circle me-2"></i>
      Producto no encontrado
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { productService } from '../services/api'
import { categoryService } from '../services/api'
import { useProductStore } from '../stores/productStore'

export default {
  name: 'ProductoDetallesPage',
  
  setup() {
    const route = useRoute()
    const productStore = useProductStore()
    const loading = ref(true)
    const error = ref(null)
    const ubicaciones = ref([])
    const categorias = ref([])

    // Computed properties
    const producto = computed(() => productStore.selectedProduct)
    
    const loadProducto = async () => {
      try {
        loading.value = true
        error.value = null
        
        const productoId = route.params.id
        if (!productoId) {
          throw new Error('ID de producto no válido')
        }

        // Intentar obtener el producto del store
        const productoData = await productStore.fetchProductById(productoId)
        if (!productoData) {
          throw new Error('No se encontró el producto')
        }

        // Cargar datos adicionales en paralelo
        const [ubicacionesData, categoriasData] = await Promise.all([
          productService.getUbicaciones(productoId),
          categoryService.getAll()
        ])

        ubicaciones.value = Array.isArray(ubicacionesData) ? ubicacionesData : []
        categorias.value = Array.isArray(categoriasData) ? categoriasData : []

        console.log('Datos cargados:', {
          producto: producto.value,
          ubicaciones: ubicaciones.value,
          categorias: categorias.value
        })
      } catch (err) {
        console.error('Error al cargar detalles del producto:', err)
        error.value = err.message || 'Error al cargar los datos'
      } finally {
        loading.value = false
      }
    }
    
    const getCategoriaName = (categoriaId) => {
      if (!categoriaId || !categorias.value) return 'N/A'
      const categoria = categorias.value.find(c => c.id === categoriaId)
      return categoria ? categoria.nombre : 'N/A'
    }
    
    const getEstadoStock = (prod) => {
      if (!prod) return 'N/A'
      if (prod.stock > prod.stock_minimo) return 'OK'
      if (prod.stock === prod.stock_minimo) return 'Mínimo'
      return 'Bajo'
    }
    
    const formatDate = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    onMounted(() => {
      loadProducto()
    })
    
    return {
      producto,
      loading,
      error,
      ubicaciones,
      getCategoriaName,
      getEstadoStock,
      formatDate
    }
  }
}
</script>

<style scoped>
.producto-detalles {
  padding: 1rem;
}

.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-title {
  color: #2c3e50;
  font-weight: 600;
}

label.text-muted {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.badge {
  font-size: 0.875rem;
  padding: 0.5em 0.75em;
}

code {
  background-color: #f8f9fa;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  color: #666;
}

.list-group-item {
  transition: background-color 0.2s;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}
</style> 
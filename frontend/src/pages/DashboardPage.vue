<template>
  <div class="dashboard container-fluid px-4">
    <h1 class="mb-4">Dashboard</h1>
    
    <div class="row g-4">
      <!-- Estadísticas Generales -->
      <div class="col-md-6 col-lg-3">
        <div class="card h-100 dashboard-card">
          <div class="card-body">
            <h5 class="card-title">Total Usuarios</h5>
            <p class="card-text display-4">{{ userCount }}</p>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="card h-100 dashboard-card">
          <div class="card-body">
            <h5 class="card-title">Total Productos</h5>
            <p class="card-text display-4">{{ productCount }}</p>
          </div>
        </div>
      </div>
      
      <div class="col-md-6 col-lg-3">
        <div class="card h-100 dashboard-card">
          <div class="card-body">
            <h5 class="card-title">Stock Total</h5>
            <p class="card-text display-4">{{ stockTotal }}</p>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="card h-100 dashboard-card">
          <div class="card-body">
            <h5 class="card-title">Productos Bajo Stock</h5>
            <p class="card-text display-4">{{ productosConBajoStock }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4 g-4">
      <div class="col-lg-6">
        <div class="card h-100 dashboard-card">
          <div class="card-body">
            <h5 class="card-title">Productos por Categoría</h5>
            <div class="chart-container">
              <ProductosPorCategoria 
                :productos="productos"
                :categorias="categorias"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-lg-6">
        <div class="card h-100 dashboard-card">
          <div class="card-body">
            <h5 class="card-title">Productos Recientes</h5>
            <DataTable
              :data="productosRecientes"
              :columns="columns"
              title="Productos Recientes"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Nuevas secciones -->
    <div class="row mt-4 g-4">
      <div class="col-lg-6">
        <div class="card h-100 dashboard-card">
          <div class="card-body">
            <h5 class="card-title">Últimos Movimientos</h5>
            <div class="list-group list-group-flush">
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
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { productService, categoryService } from '../services/api'
import ProductosPorCategoria from '../components/ProductosPorCategoria.vue'
import DataTable from '../components/DataTable.vue'
import { useProductStore } from '../stores/productStore'
import { useUserStore } from '../stores/userStore'
import { useInventoryMovementStore } from '../stores/inventoryMovementStore'

export default {
  name: 'DashboardPage',
  components: {
    ProductosPorCategoria,
    DataTable
  },
  
  setup() {
    const productStore = useProductStore()
    const userStore = useUserStore()
    const movementStore = useInventoryMovementStore()
    
    const productos = ref([])
    const categorias = ref([])
    const productosRecientes = ref([])

    // Datos mock para bodegas (deberían venir de un store)
    const bodegas = [
      { id: 1, nombre: 'Bodega Principal' },
      { id: 2, nombre: 'Bodega Secundaria' },
      { id: 3, nombre: 'Bodega Auxiliar' }
    ]
    
    const columns = [
      { title: 'Producto', data: 'nombre' },
      { title: 'Stock', data: 'stock' },
      { 
        title: 'Estado',
        data: null,
        render: (data, type, row) => {
          if (type === 'display') {
            const estado = row.stock > row.stock_minimo ? 'OK' : 
                          row.stock === row.stock_minimo ? 'Mínimo' : 'Bajo'
            const clase = row.stock > row.stock_minimo ? 'bg-success' : 
                         row.stock === row.stock_minimo ? 'bg-warning' : 'bg-danger'
            return `<span class="badge ${clase}">${estado}</span>`
          }
          return null
        }
      }
    ]

    // Computed properties
    const productCount = computed(() => productos.value.length)
    const userCount = computed(() => userStore.userCount)
    const stockTotal = computed(() => productos.value.reduce((sum, p) => sum + (p.stock || 0), 0))
    const productosConBajoStock = computed(() => 
      productos.value.filter(p => p.stock < p.stock_minimo).length
    )
    const ultimosMovimientos = computed(() => {
      return movementStore.movements.slice().reverse().slice(0, 5)
    })
    
    const loadDashboardData = async () => {
      try {
        // Cargar productos y categorías
        const [productosData, categoriasData] = await Promise.all([
          productService.getAll(),
          categoryService.getAll()
        ])
        
        // Procesar productos
        productos.value = Array.isArray(productosData) ? productosData : []
        
        // Procesar categorías
        categorias.value = Array.isArray(categoriasData) ? categoriasData : []

        // Obtener productos recientes (últimos 5)
        productosRecientes.value = [...productos.value]
          .sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))
          .slice(0, 5)

      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error)
        alert('Error al cargar los datos del dashboard. Por favor, intente de nuevo.')
      }
    }

    const getProductoNombre = (id) => {
      const producto = productos.value.find(p => p.id === id)
      return producto ? producto.nombre : 'Producto no encontrado'
    }

    const getBodegaNombre = (id) => {
      const bodega = bodegas.find(b => b.id === id)
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

    onMounted(() => {
      loadDashboardData()
    })

    return {
      productos,
      categorias,
      productosRecientes,
      columns,
      productCount,
      userCount,
      stockTotal,
      productosConBajoStock,
      ultimosMovimientos,
      getProductoNombre,
      getBodegaNombre,
      formatDate
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 2rem 0;
}

.dashboard-card {
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  background: white;
}

.dashboard-card:hover {
  transform: translateY(-5px);
}

.card-title {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.display-4 {
  font-size: 2.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.chart-container {
  min-height: 300px;
  position: relative;
}

:deep(.dataTables_wrapper) {
  padding: 0;
}

:deep(.table) {
  margin: 1rem 0;
}

.list-group-item {
  padding: 1rem;
  border: none;
  border-bottom: 1px solid #e9ecef;
}

.list-group-item:last-child {
  border-bottom: none;
}

.font-weight-bold {
  font-weight: 600;
}
</style>

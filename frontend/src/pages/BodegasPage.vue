<template>
  <div class="bodegas">
    <h1 class="mb-4">Gestión de Bodegas</h1>
    
    <!-- Widgets de Bodegas -->
    <div class="row mb-4">
      <div v-for="bodega in bodegas" :key="bodega.id" class="col-md-4 mb-3">
        <div 
          class="card h-100 bodega-card"
          :class="{ 'active': selectedBodega?.id === bodega.id }"
          @click="selectBodega(bodega)"
        >
          <div class="card-body">
            <h5 class="card-title">{{ bodega.nombre }}</h5>
            <p class="card-text">
              <small class="text-muted">{{ bodega.direccion }}</small>
            </p>
            <div class="stats">
              <div class="stat-item">
                <span class="stat-label">Capacidad:</span>
                <span class="stat-value">{{ bodega.capacidad }} unidades</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Ocupación:</span>
                <span class="stat-value">{{ calcularOcupacion(bodega.id) }}%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Tipo:</span>
                <span class="stat-value text-capitalize">{{ bodega.tipo }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Productos en Bodega Seleccionada -->
    <div v-if="selectedBodega" class="productos-bodega">
      <h2 class="h4 mb-3">Productos en {{ selectedBodega.nombre }}</h2>
      
      <DataTable
        :data="productosBodega"
        :columns="columns"
        :title="`Productos en ${selectedBodega.nombre}`"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { bodegaService } from '../services/api'
import DataTable from '../components/DataTable.vue'

export default {
  name: 'BodegasPage',
  components: { DataTable },
  
  setup() {
    const bodegas = ref([])
    const selectedBodega = ref(null)
    const inventarioBodegas = ref([])
    const productos = ref([])
    const categorias = ref([])
    
    const columns = [
      { 
        title: 'Código',
        data: 'producto.codigo',
        render: (data) => `<code>${data}</code>`
      },
      { 
        title: 'Producto',
        data: 'producto.nombre'
      },
      { 
        title: 'Categoría',
        data: 'producto.categoria_id',
        render: (data) => {
          const categoria = categorias.value.find(c => c.id === data)
          return categoria ? categoria.nombre : 'N/A'
        }
      },
      { 
        title: 'Cantidad',
        data: 'cantidad'
      },
      { 
        title: 'Ubicación',
        data: 'ubicacion',
        render: (data) => `<span class="badge bg-secondary">${data}</span>`
      },
      { 
        title: 'Stock Mínimo',
        data: 'producto.stock_minimo'
      },
      { 
        title: 'Estado',
        data: null,
        render: (data, type, row) => {
          if (type === 'display') {
            const estado = row.cantidad > row.producto.stock_minimo ? 'OK' : 
                          row.cantidad === row.producto.stock_minimo ? 'Mínimo' : 'Bajo'
            const clase = row.cantidad > row.producto.stock_minimo ? 'bg-success' : 
                         row.cantidad === row.producto.stock_minimo ? 'bg-warning' : 'bg-danger'
            return `<span class="badge ${clase}">${estado}</span>`
          }
          return null
        }
      }
    ]
    
    const productosBodega = computed(() => {
      if (!selectedBodega.value) return []
      
      return inventarioBodegas.value
        .filter(inv => inv.bodega_id === selectedBodega.value.id)
        .map(inv => ({
          ...inv,
          producto: productos.value.find(p => p.id === inv.producto_id)
        }))
    })
    
    const loadData = async () => {
      try {
        const data = await bodegaService.getData()
        bodegas.value = data.bodegas
        inventarioBodegas.value = data.inventario_bodegas
        productos.value = data.productos
        categorias.value = data.categorias
      } catch (error) {
        console.error('Error al cargar datos de bodegas:', error)
      }
    }
    
    const selectBodega = (bodega) => {
      selectedBodega.value = bodega
    }
    
    const calcularOcupacion = (bodegaId) => {
      const bodega = bodegas.value.find(b => b.id === bodegaId)
      if (!bodega) return 0
      
      const totalProductos = inventarioBodegas.value
        .filter(inv => inv.bodega_id === bodegaId)
        .reduce((sum, inv) => sum + inv.cantidad, 0)
      
      return Math.round((totalProductos / bodega.capacidad) * 100)
    }
    
    const getCategoriaName = (categoriaId) => {
      const categoria = categorias.value.find(c => c.id === categoriaId)
      return categoria ? categoria.nombre : 'N/A'
    }
    
    const getEstadoStock = (item) => {
      if (item.cantidad > item.producto.stock_minimo) return 'OK'
      if (item.cantidad === item.producto.stock_minimo) return 'Mínimo'
      return 'Bajo'
    }
    
    // Cargar datos al montar el componente
    loadData()
    
    return {
      bodegas,
      selectedBodega,
      productosBodega,
      columns,
      selectBodega,
      calcularOcupacion,
      getCategoriaName,
      getEstadoStock
    }
  }
}
</script>

<style scoped>
.bodegas {
  padding: 2rem;
}

.bodega-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  position: relative;
  overflow: hidden;
}

.bodega-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(to right, var(--bs-primary), var(--bs-info));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.bodega-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-color: var(--bs-primary);
}

.bodega-card:hover::before {
  opacity: 1;
}

.bodega-card.active {
  border-color: var(--bs-primary);
  background-color: rgba(var(--bs-primary-rgb), 0.02);
}

.bodega-card.active::before {
  opacity: 1;
}

.stats {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  border-radius: 6px;
  background-color: #f8f9fa;
}

.stat-item:last-child {
  margin-bottom: 0;
}

.stat-label {
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
}

.stat-value {
  font-weight: 600;
  color: #2c3e50;
}

.table {
  margin-bottom: 0;
}

.badge {
  padding: 0.5em 1em;
  font-weight: 500;
}

code {
  background-color: #f8f9fa;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  color: #666;
}

.productos-bodega {
  margin-top: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.productos-bodega h2 {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

:deep(.dataTables_wrapper) {
  padding: 0;
}

:deep(.table) {
  margin: 1rem 0;
}
</style> 
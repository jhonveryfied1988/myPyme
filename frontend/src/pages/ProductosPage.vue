<template>
  <div class="productos">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Listado de Productos</h1>
      <button class="btn btn-primary">
        <i class="fas fa-plus me-2"></i>Nuevo Producto
      </button>
    </div>

    <DataTable
      :data="productos"
      :columns="columns"
      routeType="productos"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { productService, categoryService } from '../services/api'
import DataTable from '../components/DataTable.vue'

export default {
  name: 'ProductosPage',
  components: { DataTable },
  
  setup() {
    const productos = ref([])
    const categorias = ref([])
    
    const columns = [
      { title: 'Código', data: 'codigo' },
      { title: 'Nombre', data: 'nombre' },
      { 
        title: 'Categoría',
        data: 'categoria_id',
        render: (data) => {
          const categoria = categorias.value.find(c => c.id === data)
          return categoria ? categoria.nombre : 'N/A'
        }
      },
      { title: 'Stock', data: 'stock' },
      { title: 'Stock Mínimo', data: 'stock_minimo' },
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
    
    const loadData = async () => {
      try {
        console.log('Cargando datos...')
        const [productosData, categoriasData] = await Promise.all([
          productService.getAll(),
          categoryService.getAll()
        ])
        
        console.log('Productos recibidos:', productosData)
        console.log('Categorías recibidas:', categoriasData)
        
        categorias.value = Array.isArray(categoriasData) ? categoriasData : (categoriasData.categorias || [])
        productos.value = Array.isArray(productosData) ? productosData : (productosData.productos || [])
      } catch (error) {
        console.error('Error al cargar datos:', error)
        alert('Error al cargar los datos. Por favor, intente de nuevo.')
      }
    }
    
    onMounted(() => {
      loadData()
    })
    
    return {
      productos,
      columns
    }
  }
}
</script>

<style scoped>
.productos {
  padding: 1rem;
}

.badge {
  padding: 0.5em 1em;
}
</style>

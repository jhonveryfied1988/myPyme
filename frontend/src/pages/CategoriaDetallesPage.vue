<template>
  <div class="container-xl">
    <div class="page-header d-print-none">
      <div class="row align-items-center">
        <div class="col">
          <h2 class="page-title">
            Detalle de Categoría
          </h2>
          <div class="text-muted mt-1">{{ categoria?.nombre || 'Cargando...' }}</div>
        </div>
        <div class="col-auto ms-auto d-print-none">
          <div class="btn-list">
            <router-link to="/categorias" class="btn btn-secondary d-none d-sm-inline-block">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-left" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M5 12l14 0"></path>
                <path d="M5 12l6 6"></path>
                <path d="M5 12l6 -6"></path>
              </svg>
              Volver
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <div class="page-body">
      <div class="row row-cards">
        <!-- Información básica -->
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Información de la Categoría</h3>
            </div>
            <div class="card-body">
              <div class="datagrid">
                <div class="datagrid-item">
                  <div class="datagrid-title">Nombre</div>
                  <div class="datagrid-content">{{ categoria?.nombre }}</div>
                </div>
                <div class="datagrid-item">
                  <div class="datagrid-title">Descripción</div>
                  <div class="datagrid-content">{{ categoria?.descripcion || 'Sin descripción' }}</div>
                </div>
                <div class="datagrid-item">
                  <div class="datagrid-title">Total de Productos</div>
                  <div class="datagrid-content">{{ productosEnCategoria.length }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Productos en esta categoría -->
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Productos en esta Categoría</h3>
            </div>
            <div class="card-body">
              <DataTable 
                :data="productosEnCategoria"
                :columns="columns"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { categoryService, productService } from '../services/api'
import DataTable from '../components/DataTable.vue'

export default {
  name: 'CategoriaDetallesPage',
  components: { DataTable },
  
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    const categoria = ref(null)
    const productos = ref([])
    
    const columns = [
      { title: 'Código', data: 'codigo' },
      { title: 'Nombre', data: 'nombre' },
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
      },
      {
        title: 'Acciones',
        data: null,
        render: (data, type, row) => {
          if (type === 'display') {
            return `
              <button class="btn btn-icon btn-primary ver-btn" title="Ver detalles">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                  <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"></path>
                </svg>
              </button>
            `
          }
          return null
        }
      }
    ]
    
    const productosEnCategoria = computed(() => {
      return productos.value.filter(p => p.categoria_id === categoria.value?.id)
    })
    
    const loadData = async () => {
      try {
        const categoriaId = route.params.id
        if (!categoriaId) {
          throw new Error('ID de categoría no válido')
        }
        
        // Cargar datos en paralelo
        const [categoriaData, productosData] = await Promise.all([
          categoryService.getById(categoriaId),
          productService.getAll()
        ])
        
        categoria.value = categoriaData
        productos.value = Array.isArray(productosData) ? productosData : []
        
        console.log('Datos cargados:', {
          categoria: categoria.value,
          productos: productos.value,
          filtrados: productosEnCategoria.value
        })
      } catch (error) {
        console.error('Error al cargar datos de la categoría:', error)
        alert('Error al cargar los datos. Por favor, intente de nuevo.')
      }
    }
    
    onMounted(() => {
      loadData()
    })
    
    return {
      categoria,
      productosEnCategoria,
      columns
    }
  }
}
</script> 
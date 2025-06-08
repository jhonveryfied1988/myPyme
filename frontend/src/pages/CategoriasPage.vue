<template>
  <div class="container-xl">
    <div class="page-header d-print-none">
      <div class="row align-items-center">
        <div class="col">
          <h2 class="page-title">Categorías</h2>
        </div>
      </div>
    </div>
    
    <div class="page-body">
      <div class="card">
        <div class="card-body">
          <DataTable 
            :data="categorias"
            :columns="columns"
            routeType="categorias"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { categoryService } from '../services/api'
import DataTable from '../components/DataTable.vue'

export default {
  name: 'CategoriasPage',
  components: { DataTable },
  
  setup() {
    const categorias = ref([])
    
    const columns = [
      { title: 'Nombre', data: 'nombre' },
      { title: 'Descripción', data: 'descripcion' },
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
    
    const loadCategorias = async () => {
      try {
        const data = await categoryService.getAll()
        categorias.value = Array.isArray(data) ? data : []
        console.log('Categorías cargadas:', categorias.value)
      } catch (error) {
        console.error('Error al cargar categorías:', error)
        alert('Error al cargar las categorías. Por favor, intente de nuevo.')
      }
    }
    
    onMounted(() => {
      loadCategorias()
    })
    
    return {
      categorias,
      columns
    }
  }
}
</script>

<style scoped>
.categorias {
  padding: 1rem;
}
</style>

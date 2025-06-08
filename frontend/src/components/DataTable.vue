<template>
  <div class="datatable-wrapper">
    <div class="table-responsive">
      <table ref="dataTable" class="table table-striped table-hover">
        <thead>
          <tr>
            <th v-for="column in columnsWithActions" :key="column.title">
              {{ column.title }}
            </th>
          </tr>
        </thead>
      </table>
    </div>
    
    <!-- Modal de Detalles -->
    <div class="modal fade" id="detallesModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedItem" class="details-grid">
              <template v-for="(value, key) in formattedDetails" :key="key">
                <div class="detail-label">{{ key }}:</div>
                <div class="detail-value">{{ value }}</div>
              </template>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import $ from 'jquery'
import 'datatables.net'
import 'datatables.net-bs5'
import 'datatables.net-buttons-bs5'
import 'datatables.net-buttons/js/buttons.html5'
import 'datatables.net-buttons/js/buttons.print'
import { Modal } from 'bootstrap'
import { useProductStore } from '../stores/productStore'

export default {
  name: 'DataTable',
  props: {
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    routeType: {
      type: String,
      default: 'productos' // puede ser 'productos' o 'categorias'
    },
    title: {
      type: String,
      default: 'Detalles'
    }
  },

  setup(props) {
    const dataTable = ref(null)
    const router = useRouter()
    const selectedItem = ref(null)
    let modal = null
    let table = null

    const columnsWithActions = computed(() => [
      ...props.columns,
      {
        title: 'Acciones',
        data: null,
        orderable: false,
        render: (data, type, row) => {
          if (type === 'display') {
            return `
              <button class="btn btn-sm btn-info ver-btn" data-id="${row.id}" title="Ver detalles">
                <i class="fas fa-eye"></i> Ver
              </button>
            `
          }
          return null
        }
      }
    ])

    const initializeDataTable = () => {
      const tableElement = $(dataTable.value)
      const productStore = useProductStore()
      
      table = tableElement.DataTable({
        data: props.data,
        columns: columnsWithActions.value,
        language: {
          processing: "Procesando...",
          lengthMenu: "Mostrar _MENU_ registros",
          zeroRecords: "No se encontraron resultados",
          emptyTable: "Ningún dato disponible en esta tabla",
          info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
          infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
          infoFiltered: "(filtrado de un total de _MAX_ registros)",
          search: "Buscar:",
          loadingRecords: "Cargando...",
          paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior"
          },
          aria: {
            sortAscending: ": Activar para ordenar la columna de manera ascendente",
            sortDescending: ": Activar para ordenar la columna de manera descendente"
          }
        },
        dom: 'Bfrtip',
        buttons: [
          {
            extend: 'collection',
            text: '<i class="fas fa-download me-1"></i>Exportar',
            buttons: [
              {
                extend: 'excel',
                text: '<i class="fas fa-file-excel me-1"></i>Excel',
                className: 'dropdown-item',
                exportOptions: {
                  columns: ':visible:not(:last-child)'
                }
              },
              {
                extend: 'pdf',
                text: '<i class="fas fa-file-pdf me-1"></i>PDF',
                className: 'dropdown-item',
                exportOptions: {
                  columns: ':visible:not(:last-child)'
                }
              },
              {
                extend: 'copy',
                text: '<i class="fas fa-copy me-1"></i>Copiar',
                className: 'dropdown-item',
                exportOptions: {
                  columns: ':visible:not(:last-child)'
                }
              }
            ],
            className: 'btn btn-secondary dropdown-toggle'
          }
        ]
      })

      // Manejar el click en el botón "Ver"
      tableElement.on('click', '.ver-btn', function(e) {
        e.preventDefault()
        const rowData = table.row($(this).closest('tr')).data()
        
        if (props.routeType === 'productos') {
          // Guardar el producto seleccionado en el store antes de navegar
          productStore.setSelectedProduct(rowData)
          router.push(`/productos/${rowData.id}`)
        } else if (props.routeType === 'categorias') {
          router.push(`/categorias/${rowData.id}`)
        }
      })
    }

    const modalTitle = computed(() => {
      return `${props.title} ${selectedItem.value?.nombre || ''}`
    })

    const formattedDetails = computed(() => {
      if (!selectedItem.value) return {}
      
      const details = {}
      props.columns.forEach(column => {
        if (column.data && selectedItem.value[column.data]) {
          details[column.title] = selectedItem.value[column.data]
        }
      })
      return details
    })

    onMounted(() => {
      initializeDataTable()

      // Inicializar modal
      const modalElement = document.getElementById('detallesModal')
      if (modalElement) {
        modal = new Modal(modalElement)
      }
    })

    onUnmounted(() => {
      if (table) {
        table.destroy()
      }
      if (modal) {
        modal.dispose()
      }
    })

    watch(() => props.data, () => {
      if (table) {
        table.destroy()
        initializeDataTable()
      }
    }, { deep: true })

    return {
      dataTable,
      columnsWithActions,
      selectedItem,
      modalTitle,
      formattedDetails
    }
  }
}
</script>

<style scoped>
.datatable-wrapper {
  margin: 1rem 0;
}

.details-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem 1rem;
  align-items: baseline;
}

.detail-label {
  font-weight: 500;
  color: #666;
}

.detail-value {
  color: #333;
}

:deep(.btn) {
  margin: 0 0.25rem;
}

:deep(.fas) {
  margin-right: 0.25rem;
}

:deep(.dataTables_wrapper) {
  padding: 1rem;
}

:deep(.dataTables_filter) {
  margin-bottom: 1rem;
}

:deep(.dataTables_info) {
  padding-top: 0.5rem;
}

:deep(.dataTables_paginate) {
  padding-top: 0.5rem;
}

:deep(.dropdown-menu) {
  padding: 0.5rem;
}

:deep(.dropdown-item) {
  padding: 0.5rem 1rem;
}

:deep(.dropdown-item:hover) {
  background-color: #f8f9fa;
}
</style> 
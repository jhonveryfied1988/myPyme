<template>
  <div class="chart-container">
    <Pie
      v-if="chartData.datasets"
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

export default defineComponent({
  name: 'ProductosPorCategoria',
  components: { Pie },
  props: {
    productos: {
      type: Array,
      required: true
    },
    categorias: {
      type: Array,
      required: true
    }
  },
  computed: {
    chartData() {
      // Contar productos por categoría
      const productosPorCategoria = this.categorias.map(categoria => {
        return this.productos.filter(p => p.categoria_id === categoria.id).length
      })

      // Generar colores aleatorios pero agradables
      const colors = this.categorias.map((_, index) => {
        const hue = (index * 137.5) % 360 // Distribución uniforme de colores
        return `hsl(${hue}, 70%, 60%)`
      })

      return {
        labels: this.categorias.map(c => c.nombre),
        datasets: [
          {
            backgroundColor: colors,
            data: productosPorCategoria
          }
        ]
      }
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: {
                size: 12
              },
              padding: 20
            }
          },
          title: {
            display: true,
            text: 'Productos por Categoría',
            font: {
              size: 16
            },
            padding: {
              top: 10,
              bottom: 20
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || ''
                const value = context.raw || 0
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = ((value * 100) / total).toFixed(1)
                return `${label}: ${value} (${percentage}%)`
              }
            }
          }
        }
      }
    }
  }
})
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style> 
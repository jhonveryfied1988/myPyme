import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../pages/DashboardPage.vue'
import ProductosPage from '../pages/ProductosPage.vue'
import ProductoDetallesPage from '../pages/ProductoDetallesPage.vue'
import CategoriasPage from '../pages/CategoriasPage.vue'
import CategoriaDetallesPage from '../pages/CategoriaDetallesPage.vue'
import ProfilePage from '../pages/ProfilePage.vue'
import MovimientoInventarioPage from '../pages/MovimientoInventarioPage.vue'
import ReporteProductosPage from '../pages/reportes/ReporteProductosPage.vue'
import ReporteMovimientosPage from '../pages/reportes/ReporteMovimientosPage.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { title: 'Dashboard' }
  },
  {
    path: '/productos',
    name: 'Productos',
    component: ProductosPage,
    meta: { title: 'Productos' }
  },
  {
    path: '/productos/:id',
    name: 'ProductoDetalles',
    component: ProductoDetallesPage,
    meta: { title: 'Detalle de Producto' }
  },
  {
    path: '/categorias',
    name: 'Categorias',
    component: CategoriasPage,
    meta: { title: 'Categorías' }
  },
  {
    path: '/categorias/:id',
    name: 'CategoriaDetalles',
    component: CategoriaDetallesPage,
    meta: { title: 'Detalle de Categoría' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/movimiento-inventario',
    name: 'MovimientoInventario',
    component: MovimientoInventarioPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/reportes/productos',
    name: 'ReporteProductos',
    component: ReporteProductosPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/reportes/movimientos',
    name: 'ReporteMovimientos',
    component: ReporteMovimientosPage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from './pages/LoginPage.vue'
import DashboardPage from './pages/DashboardPage.vue'
import ProductosPage from './pages/ProductosPage.vue'
import CategoriasPage from './pages/CategoriasPage.vue'
import RecuperarPage from './pages/RecuperarPage.vue'

const routes = [
  { path: '/', component: LoginPage },
  { path: '/dashboard', component: DashboardPage },
  { path: '/productos', component: ProductosPage },
  { path: '/categorias', component: CategoriasPage },
  { path: '/recuperar', component: RecuperarPage }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

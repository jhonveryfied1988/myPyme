import { createRouter, createWebHistory } from 'vue-router'
import { auth } from './utils/auth'
import LoginPage from './pages/LoginPage.vue'
import DashboardPage from './pages/DashboardPage.vue'
import ProductosPage from './pages/ProductosPage.vue'
import ProductoDetallesPage from './pages/ProductoDetallesPage.vue'
import CategoriasPage from './pages/CategoriasPage.vue'
import RecuperarPage from './pages/RecuperarPage.vue'
import BodegasPage from './pages/BodegasPage.vue'

const routes = [
  { 
    path: '/', 
    name: 'login',
    component: LoginPage,
    meta: { 
      requiresGuest: true,
      title: 'Iniciar Sesión'
    }
  },
  { 
    path: '/dashboard', 
    name: 'dashboard',
    component: DashboardPage,
    meta: { 
      requiresAuth: true,
      section: 'Panel de Control',
      title: 'Dashboard'
    }
  },
  { 
    path: '/productos', 
    name: 'productos',
    component: ProductosPage,
    meta: { 
      requiresAuth: true,
      section: 'Inventario',
      title: 'Productos'
    }
  },
  { 
    path: '/bodegas', 
    name: 'bodegas',
    component: BodegasPage,
    meta: { 
      requiresAuth: true,
      section: 'Almacenamiento',
      title: 'Gestión de Bodegas'
    }
  },
  { 
    path: '/categorias', 
    name: 'categorias',
    component: CategoriasPage,
    meta: { 
      requiresAuth: true,
      section: 'Inventario',
      title: 'Categorías'
    }
  },
  { 
    path: '/recuperar', 
    name: 'recuperar',
    component: RecuperarPage,
    meta: { 
      requiresGuest: true,
      title: 'Recuperar Contraseña'
    }
  },
  { 
    path: '/productos/:id', 
    name: 'producto-detalles',
    component: ProductoDetallesPage,
    meta: { 
      requiresAuth: true,
      section: 'Inventario',
      title: 'Detalles del Producto'
    }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = auth.isAuthenticated()
  
  // Actualizar el título de la página
  document.title = `MyPyme - ${to.meta.title || 'Sistema de Gestión'}`

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        path: '/',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (isAuthenticated) {
      next('/dashboard')
    } else {
      next()
    }
  } else {
    next()
  }
})

// Manejar errores de navegación
router.onError((error) => {
  console.error('Error de navegación:', error)
  router.push('/')
})

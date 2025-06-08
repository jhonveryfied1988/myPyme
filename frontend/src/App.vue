<template>
  <div class="page">
    <!-- Navbar -->
    <header v-if="isAuthenticated && !isLoginPage" class="navbar navbar-expand-md navbar-light d-print-none">
      <div class="container-xl">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu">
          <span class="navbar-toggler-icon"></span>
        </button>
        <h1 class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
          <router-link to="/dashboard">
            MyPyme
          </router-link>
        </h1>
        <div class="navbar-nav flex-row order-md-last">
          <div class="nav-item dropdown">
            <a href="#" class="nav-link d-flex lh-1 text-reset p-0" data-bs-toggle="dropdown" aria-label="Open user menu">
              <span class="avatar avatar-sm" style="background-image: url(https://www.gravatar.com/avatar/?d=mp)"></span>
              <div class="d-none d-xl-block ps-2">
                <div>{{ currentUser?.nombre || 'Usuario' }}</div>
                <div class="mt-1 small text-muted">{{ currentUser?.rol || 'Rol' }}</div>
              </div>
            </a>
            <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
              <a href="#" class="dropdown-item" @click.prevent="handleLogout">Cerrar Sesión</a>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Navbar menu -->
    <div v-if="isAuthenticated && !isLoginPage" class="navbar-expand-md">
      <div class="collapse navbar-collapse" id="navbar-menu">
        <div class="navbar navbar-light">
          <div class="container-xl">
            <ul class="navbar-nav">
              <li class="nav-item">
                <router-link class="nav-link" to="/dashboard">
                  <span class="nav-link-icon d-md-none d-lg-inline-block">
                    <i class="ti ti-dashboard"></i>
                  </span>
                  <span class="nav-link-title">Dashboard</span>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/bodegas">
                  <span class="nav-link-icon d-md-none d-lg-inline-block">
                    <i class="ti ti-building-warehouse"></i>
                  </span>
                  <span class="nav-link-title">Bodegas</span>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/productos">
                  <span class="nav-link-icon d-md-none d-lg-inline-block">
                    <i class="ti ti-box"></i>
                  </span>
                  <span class="nav-link-title">Productos</span>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/categorias">
                  <span class="nav-link-icon d-md-none d-lg-inline-block">
                    <i class="ti ti-tags"></i>
                  </span>
                  <span class="nav-link-title">Categorías</span>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Page body -->
    <div class="page-wrapper">
      <div v-if="isAuthenticated && !isLoginPage" class="page-header d-print-none">
        <div class="container-xl">
          <div class="row g-2 align-items-center">
            <div class="col">
              <div class="page-pretitle">{{ route.meta.section || 'Sistema' }}</div>
              <h2 class="page-title">{{ route.meta.title || 'MyPyme' }}</h2>
            </div>
          </div>
        </div>
      </div>
      <div class="page-body">
        <div class="container-xl">
          <router-view @login="handleLogin"></router-view>
        </div>
      </div>
    </div>

    <Toast ref="toastRef" />
    <LoadingSpinner v-if="isLoading" />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { auth } from './utils/auth'
import Toast from './components/Toast.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'

export default {
  name: 'App',
  components: {
    Toast,
    LoadingSpinner
  },
  
  setup() {
    const router = useRouter()
    const route = useRoute()
    const toastRef = ref(null)
    const isLoading = ref(false)
    
    const currentUser = computed(() => auth.getUser())
    const isAuthenticated = computed(() => auth.isAuthenticated())
    const isLoginPage = computed(() => route.name === 'login')
    
    const showToast = (type, message) => {
      if (toastRef.value) {
        toastRef.value.show(type, message)
      }
    }
    
    const handleLogin = (user) => {
      showToast('success', `Bienvenido ${user.nombre}`)
    }
    
    const handleLogout = async () => {
      try {
        isLoading.value = true
        auth.logout()
        router.push('/')
        showToast('info', 'Sesión cerrada correctamente')
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
        showToast('error', 'Error al cerrar sesión')
      } finally {
        isLoading.value = false
      }
    }
    
    onMounted(() => {
      if (!auth.validateStoredData()) {
        router.push('/')
      }
    })
    
    return {
      route,
      toastRef,
      isLoading,
      currentUser,
      isAuthenticated,
      isLoginPage,
      handleLogin,
      handleLogout
    }
  }
}
</script>

<style>
.navbar-brand-image {
  height: 2rem;
}

.nav-link-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
  color: inherit;
}

.page-pretitle {
  font-size: 0.825rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #656d77;
  margin-bottom: 0.25rem;
}

.page-title {
  margin: 0;
  font-size: 1.5rem;
  line-height: 1.5;
  font-weight: 600;
  color: #1e293b;
  word-break: break-word;
}

.dropdown-menu {
  margin-top: 0.75rem;
}

.avatar {
  --tblr-avatar-size: 2.5rem;
  position: relative;
  width: var(--tblr-avatar-size);
  height: var(--tblr-avatar-size);
  border-radius: 50%;
  background: #e9ecef no-repeat center/cover;
  color: #656d77;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border: 2px solid #fff;
}

.avatar-sm {
  --tblr-avatar-size: 2rem;
}
</style>

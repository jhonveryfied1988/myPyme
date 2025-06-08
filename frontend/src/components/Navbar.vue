<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">MyPyme</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <!-- Dashboard -->
          <li class="nav-item">
            <router-link class="nav-link" to="/">
              <i class="fas fa-home me-1"></i>Dashboard
            </router-link>
          </li>
          
          <!-- Productos -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
              <i class="fas fa-box me-1"></i>Productos
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link class="dropdown-item" to="/productos">
                  <i class="fas fa-list me-2"></i>Lista de Productos
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/categorias">
                  <i class="fas fa-tags me-2"></i>Categorías
                </router-link>
              </li>
            </ul>
          </li>

          <!-- Movimientos de Inventario -->
          <li class="nav-item">
            <router-link class="nav-link" to="/movimiento-inventario">
              <i class="fas fa-exchange-alt me-1"></i>Movimientos de Inventario
            </router-link>
          </li>

          <!-- Reportes -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
              <i class="fas fa-chart-bar me-1"></i>Reportes
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link class="dropdown-item" to="/reportes/productos">
                  <i class="fas fa-box me-2"></i>Reporte de Productos
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/reportes/categorias">
                  <i class="fas fa-tags me-2"></i>Reporte de Categorías
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/reportes/bodegas">
                  <i class="fas fa-warehouse me-2"></i>Reporte de Bodegas
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <router-link class="dropdown-item" to="/reportes/movimientos">
                  <i class="fas fa-exchange-alt me-2"></i>Reporte de Movimientos
                </router-link>
              </li>
            </ul>
          </li>
        </ul>

        <!-- Usuario -->
        <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
              <i class="fas fa-user me-1"></i>
              {{ userStore.currentUser?.nombre || 'Usuario' }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <router-link class="dropdown-item" to="/profile">
                  <i class="fas fa-user-circle me-2"></i>Mi Perfil
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/configuracion">
                  <i class="fas fa-cog me-2"></i>Configuración
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item text-danger" href="#" @click.prevent="logout">
                  <i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

export default {
  name: 'Navbar',
  
  setup() {
    const userStore = useUserStore()
    const router = useRouter()

    onMounted(() => {
      // Inicializar los dropdowns de Bootstrap
      const dropdownElementList = document.querySelectorAll('.dropdown-toggle')
      const dropdownList = [...dropdownElementList].map(dropdownToggleEl => {
        return new bootstrap.Dropdown(dropdownToggleEl)
      })
    })

    const logout = async () => {
      try {
        await userStore.logout()
        router.push('/login')
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
      }
    }

    return {
      userStore,
      logout
    }
  }
}
</script>

<style scoped>
.navbar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 1rem;
  background-color: #ffffff !important;
}

.navbar-brand {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.5rem;
}

.nav-link {
  color: #4a5568 !important;
  font-weight: 500;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #2c3e50 !important;
  background-color: #f8f9fa;
}

.nav-link.active {
  color: #2c3e50 !important;
  font-weight: 600;
  background-color: #e9ecef;
}

.dropdown-menu {
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  color: #4a5568;
  transition: all 0.2s ease;
}

.dropdown-item i {
  width: 1.25rem;
  text-align: center;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #2c3e50;
  transform: translateX(5px);
}

.dropdown-item.active {
  background-color: #e9ecef;
  color: #2c3e50;
}

.text-danger {
  color: #dc3545 !important;
}

.text-danger:hover {
  background-color: #dc354511 !important;
}

.navbar-toggler {
  border: none;
  padding: 0.5rem;
}

.navbar-toggler:focus {
  box-shadow: none;
}

@media (max-width: 991.98px) {
  .dropdown-menu {
    border: none;
    box-shadow: none;
    padding-left: 1rem;
  }
  
  .navbar-collapse {
    padding: 1rem 0;
  }
}
</style> 
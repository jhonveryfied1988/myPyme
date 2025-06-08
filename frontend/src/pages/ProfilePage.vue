<template>
  <div class="profile-page">
    <div class="container-xl">
      <div class="page-header d-print-none">
        <div class="row align-items-center">
          <div class="col">
            <h2 class="page-title">Perfil de Usuario</h2>
          </div>
        </div>
      </div>

      <div class="page-body">
        <div class="row">
          <!-- Información del Perfil -->
          <div class="col-md-8">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Información Personal</h3>
              </div>
              <div class="card-body">
                <form @submit.prevent="updateProfile">
                  <div class="mb-3">
                    <label class="form-label">Nombre</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="formData.nombre"
                      required
                    >
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input 
                      type="email" 
                      class="form-control" 
                      v-model="formData.email"
                      required
                    >
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Teléfono</label>
                    <input 
                      type="tel" 
                      class="form-control" 
                      v-model="formData.telefono"
                    >
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Cargo</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="formData.cargo"
                      readonly
                    >
                  </div>
                  <div class="form-footer">
                    <button type="submit" class="btn btn-primary">
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Estadísticas y Acciones -->
          <div class="col-md-4">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Estadísticas</h3>
              </div>
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="subheader">Último acceso</div>
                  <div class="ms-auto">{{ formatDate(currentUser?.ultimo_acceso) }}</div>
                </div>
                <div class="d-flex align-items-center mb-3">
                  <div class="subheader">Movimientos realizados</div>
                  <div class="ms-auto">{{ movimientosCount }}</div>
                </div>
                <div class="d-flex align-items-center">
                  <div class="subheader">Estado</div>
                  <div class="ms-auto">
                    <span class="badge bg-success">Activo</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="card mt-3">
              <div class="card-header">
                <h3 class="card-title">Seguridad</h3>
              </div>
              <div class="card-body">
                <button 
                  class="btn btn-outline-primary w-100 mb-2"
                  @click="changePassword"
                >
                  Cambiar Contraseña
                </button>
                <button 
                  class="btn btn-outline-danger w-100"
                  @click="logout"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Cambiar Contraseña -->
    <div class="modal fade" id="passwordModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Cambiar Contraseña</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updatePassword">
              <div class="mb-3">
                <label class="form-label">Contraseña Actual</label>
                <input 
                  type="password" 
                  class="form-control" 
                  v-model="passwordData.currentPassword"
                  required
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Nueva Contraseña</label>
                <input 
                  type="password" 
                  class="form-control" 
                  v-model="passwordData.newPassword"
                  required
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Confirmar Nueva Contraseña</label>
                <input 
                  type="password" 
                  class="form-control" 
                  v-model="passwordData.confirmPassword"
                  required
                >
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  Cancelar
                </button>
                <button type="submit" class="btn btn-primary">
                  Actualizar Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Modal } from 'bootstrap'
import { useUserStore } from '../stores/userStore'
import { useInventoryMovementStore } from '../stores/inventoryMovementStore'

export default {
  name: 'ProfilePage',
  
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const movementStore = useInventoryMovementStore()
    let passwordModal = null

    const currentUser = computed(() => userStore.currentUser)
    const movimientosCount = computed(() => {
      return movementStore.movements.filter(m => m.usuario_id === currentUser.value?.id).length
    })

    const formData = ref({
      nombre: '',
      email: '',
      telefono: '',
      cargo: ''
    })

    const passwordData = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const initForm = () => {
      if (currentUser.value) {
        formData.value = {
          nombre: currentUser.value.nombre,
          email: currentUser.value.email,
          telefono: currentUser.value.telefono || '',
          cargo: currentUser.value.cargo || ''
        }
      }
    }

    const updateProfile = async () => {
      try {
        await userStore.updateProfile(formData.value)
        alert('Perfil actualizado correctamente')
      } catch (error) {
        alert('Error al actualizar el perfil')
      }
    }

    const changePassword = () => {
      passwordModal.show()
    }

    const updatePassword = async () => {
      if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
        alert('Las contraseñas no coinciden')
        return
      }

      try {
        // Aquí iría la lógica para actualizar la contraseña
        passwordModal.hide()
        passwordData.value = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
        alert('Contraseña actualizada correctamente')
      } catch (error) {
        alert('Error al actualizar la contraseña')
      }
    }

    const logout = async () => {
      try {
        await userStore.logout()
        router.push('/login')
      } catch (error) {
        alert('Error al cerrar sesión')
      }
    }

    const formatDate = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    onMounted(() => {
      initForm()
      passwordModal = new Modal(document.getElementById('passwordModal'))
    })

    return {
      currentUser,
      formData,
      passwordData,
      movimientosCount,
      updateProfile,
      changePassword,
      updatePassword,
      logout,
      formatDate
    }
  }
}
</script>

<style scoped>
.profile-page {
  padding: 1rem;
}

.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-title {
  color: #2c3e50;
  font-weight: 600;
}

.subheader {
  color: #6c757d;
  font-size: 0.875rem;
}

.form-footer {
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}
</style> 
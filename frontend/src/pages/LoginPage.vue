<template>
  <div class="card p-4 mx-auto" style="max-width: 400px">
    <h2 class="mb-4 text-center">Iniciar Sesión</h2>
    
    <div class="alert alert-info" role="alert">
      <small>
        <strong>Credenciales por defecto:</strong><br>
        Admin: admin@inventario.com / 1234<br>
        Vendedor: laura@inventario.com / 5678
      </small>
    </div>

    <div class="mb-3">
      <label for="email" class="form-label">Correo electrónico</label>
      <input 
        id="email"
        type="email"
        class="form-control" 
        v-model="email" 
        placeholder="Correo"
        :class="{ 'is-invalid': error }"
        @keyup.enter="login"
        autocomplete="email"
      />
    </div>

    <div class="mb-3">
      <label for="password" class="form-label">Contraseña</label>
      <input 
        id="password"
        type="password" 
        class="form-control" 
        v-model="password" 
        placeholder="Contraseña"
        :class="{ 'is-invalid': error }"
        @keyup.enter="login"
        autocomplete="current-password"
      />
      <div v-if="error" class="invalid-feedback">
        {{ error }}
      </div>
    </div>

    <button 
      class="btn btn-primary w-100" 
      @click="login"
      :disabled="isLoading || !isFormValid"
    >
      <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
      {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
    </button>

    <div class="mt-3 text-center">
      <small class="text-muted">
        Sistema de Gestión MyPyme
      </small>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '../services/api'
import { auth } from '../utils/auth'

export default {
  name: 'LoginPage',
  emits: ['login'],
  
  setup(props, { emit }) {
    const router = useRouter()
    const route = useRoute()
    
    const email = ref('admin@inventario.com')
    const password = ref('1234')
    const error = ref(null)
    const isLoading = ref(false)
    
    const isFormValid = computed(() => {
      return email.value && password.value && 
             email.value.includes('@') &&
             password.value.length >= 4
    })
    
    const login = async () => {
      if (isLoading.value || !isFormValid.value) return
      
      error.value = null
      isLoading.value = true
      
      try {
        const data = await authService.login({
          email: email.value,
          password: password.value
        })
        
        if (data.user && data.token) {
          const success = auth.login(data.token, data.user)
          if (success) {
            emit('login', data.user)
            const redirectPath = route.query.redirect || '/dashboard'
            router.push(redirectPath)
          } else {
            throw new Error('Error al guardar la sesión')
          }
        } else {
          throw new Error('Credenciales incorrectas')
        }
      } catch (err) {
        error.value = err.message || 'Error al iniciar sesión'
        console.error('Error de login:', err)
      } finally {
        isLoading.value = false
      }
    }
    
    return {
      email,
      password,
      error,
      isLoading,
      isFormValid,
      login
    }
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  margin-top: 2rem;
}

.btn-primary {
  padding: 0.8rem;
  font-weight: 500;
}

.alert {
  font-size: 0.9rem;
}

.invalid-feedback {
  display: block;
}

input.is-invalid {
  border-color: #dc3545;
  padding-right: calc(1.5em + 0.75rem);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}
</style>

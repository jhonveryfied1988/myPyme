<template>
  <div class="toast-container position-fixed top-0 end-0 p-3">
    <div 
      class="toast"
      :class="{ show: isVisible }"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="toast-header" :class="headerClass">
        <strong class="me-auto text-white">{{ title }}</strong>
        <button 
          type="button" 
          class="btn-close btn-close-white" 
          @click="hide"
          aria-label="Cerrar"
        ></button>
      </div>
      <div class="toast-body">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'Toast',
  
  setup() {
    const isVisible = ref(false)
    const type = ref('info')
    const message = ref('')
    const title = ref('Notificación')
    let timeout = null

    const headerClass = computed(() => ({
      'bg-success': type.value === 'success',
      'bg-danger': type.value === 'error',
      'bg-info': type.value === 'info',
      'bg-warning': type.value === 'warning'
    }))

    const show = (messageType, messageText, duration = 3000) => {
      // Limpiar timeout anterior si existe
      if (timeout) {
        clearTimeout(timeout)
      }

      // Actualizar estado
      type.value = messageType
      message.value = messageText
      
      // Actualizar título según el tipo
      switch (messageType) {
        case 'success':
          title.value = 'Éxito'
          break
        case 'error':
          title.value = 'Error'
          break
        case 'warning':
          title.value = 'Advertencia'
          break
        default:
          title.value = 'Información'
      }

      // Mostrar toast
      isVisible.value = true

      // Ocultar después del tiempo especificado
      timeout = setTimeout(() => {
        hide()
      }, duration)
    }

    const hide = () => {
      isVisible.value = false
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
    }

    return {
      isVisible,
      message,
      title,
      headerClass,
      show,
      hide
    }
  }
}
</script>

<style scoped>
.toast-container {
  z-index: 1050;
}

.toast {
  min-width: 250px;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.toast.show {
  opacity: 1;
}

.toast-header {
  padding: 0.5rem 1rem;
}

.toast-body {
  padding: 1rem;
  background-color: white;
}

.btn-close {
  margin-left: 0.5rem;
}
</style> 
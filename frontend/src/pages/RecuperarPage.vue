<template>
  <div class="card p-4 mx-auto" style="max-width: 400px">
    <h2>Recuperar Contraseña</h2>
    <input class="form-control mb-2" v-model="email" placeholder="Correo electrónico" />
    <button class="btn btn-warning" @click="recover">Recuperar</button>
    <p v-if="mensaje" class="mt-3">{{ mensaje }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return { email: '', mensaje: '' }
  },
  methods: {
    async recover() {
      const res = await fetch('http://localhost:4000/api/auth/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.email })
      });
      const data = await res.json();
      this.mensaje = data.message || 'Solicitud enviada';
    }
  }
}
</script>

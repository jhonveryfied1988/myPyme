<template>
  <div class="card p-4 mx-auto" style="max-width: 400px">
    <h2 class="mb-3">Iniciar Sesión</h2>
    <input class="form-control mb-2" v-model="email" placeholder="Correo" />
    <input type="password" class="form-control mb-2" v-model="password" placeholder="Contraseña" />
    <button class="btn btn-primary" @click="login">Entrar</button>
  </div>
</template>

<script>
export default {
  data() {
    return { email: '', password: '' }
  },
  methods: {
    async login() {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.email, password: this.password })
      });
      const data = await res.json();
      if (data.user) this.$emit('login', data.user);
      else alert('Credenciales incorrectas');
    }
  }
}
</script>

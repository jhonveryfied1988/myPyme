<template>
  <div>
    <h2>Bienvenido, {{ user.nombre }}</h2>
    <div v-if="resumen" class="mb-3">
      <p><strong>Usuarios:</strong> {{ resumen.totalUsuarios }}</p>
      <p><strong>Productos:</strong> {{ resumen.totalProductos }}</p>
    </div>
    <h4>Productos</h4>
    <ul class="list-group">
      <li v-for="p in productos" :key="p.id" class="list-group-item d-flex justify-content-between">
        {{ p.nombre }}
        <span>Stock: {{ p.stock }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['user'],
  data() {
    return { resumen: null, productos: [] }
  },
  async mounted() {
    const r = await fetch('http://localhost:4000/api/dashboard/resumen');
    this.resumen = await r.json();
    const p = await fetch('http://localhost:4000/api/productos/');
    this.productos = await p.json();
  }
}
</script>

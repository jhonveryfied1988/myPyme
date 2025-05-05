<template>
  <div>
    <h3>Listado de Productos</h3>
    <ul class="list-group mb-3">
      <li v-for="p in productos" :key="p.id" class="list-group-item d-flex justify-content-between">
        {{ p.nombre }}
        <span>Stock: {{ p.stock }} (mín: {{ p.stock_minimo }})</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return { productos: [] }
  },
  async mounted() {
    const res = await fetch('http://localhost:4000/api/productos/');
    this.productos = await res.json();
  }
}
</script>

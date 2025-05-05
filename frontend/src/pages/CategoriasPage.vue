<template>
  <div>
    <h3>Categorías Disponibles</h3>
    <ul class="list-group">
      <li v-for="cat in categorias" :key="cat.id" class="list-group-item">
        {{ cat.nombre }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return { categorias: [] }
  },
  async mounted() {
    const res = await fetch('http://localhost:4000/api/productos/categorias');
    this.categorias = await res.json();
  }
}
</script>

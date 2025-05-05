<template>
  <div class="container mt-4">
    <LoginPage v-if="!user" @login="handleLogin" />
    <DashboardPage v-else :user="user" />
  </div>
</template>

<script>
import LoginPage from './pages/LoginPage.vue'
import DashboardPage from './pages/DashboardPage.vue'

export default {
  components: { LoginPage, DashboardPage },
  data() {
    return { user: null }
  },
  methods: {
    handleLogin(u) {
      this.user = u
    }
  }
}
</script>

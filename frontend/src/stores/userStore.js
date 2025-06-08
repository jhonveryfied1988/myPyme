import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    users: [],
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.currentUser,
    userCount: (state) => state.users.length,
    getUserById: (state) => (id) => state.users.find(u => u.id === id)
  },

  actions: {
    setCurrentUser(user) {
      this.currentUser = user
    },

    setUsers(users) {
      this.users = users
    },

    updateProfile(userData) {
      if (this.currentUser) {
        this.currentUser = { ...this.currentUser, ...userData }
        // Aquí podrías agregar la lógica para persistir en el backend
      }
    },

    logout() {
      this.currentUser = null
      // Aquí podrías agregar la lógica de logout del backend
    }
  }
}) 
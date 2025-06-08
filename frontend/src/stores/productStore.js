import { defineStore } from 'pinia'
import { productService } from '../services/api'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    selectedProduct: null,
    loading: false,
    error: null
  }),

  getters: {
    getProductById: (state) => (id) => {
      return state.products.find(p => p.id === parseInt(id))
    },
    getProductsByCategory: (state) => (categoryId) => {
      return state.products.filter(p => p.categoria_id === parseInt(categoryId))
    }
  },

  actions: {
    async fetchProducts() {
      try {
        this.loading = true
        this.error = null
        const products = await productService.getAll()
        this.products = Array.isArray(products) ? products : []
      } catch (error) {
        console.error('Error fetching products:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async fetchProductById(id) {
      try {
        // First check if we already have the product in the store
        const existingProduct = this.getProductById(id)
        if (existingProduct) {
          this.selectedProduct = existingProduct
          return existingProduct
        }

        // If not, fetch it from the API
        this.loading = true
        this.error = null
        const product = await productService.getById(id)
        if (product) {
          // Update both the selected product and the products array
          this.selectedProduct = product
          const index = this.products.findIndex(p => p.id === product.id)
          if (index === -1) {
            this.products.push(product)
          } else {
            this.products[index] = product
          }
        }
        return product
      } catch (error) {
        console.error('Error fetching product:', error)
        this.error = error.message
        return null
      } finally {
        this.loading = false
      }
    },

    setSelectedProduct(product) {
      this.selectedProduct = product
    },

    clearSelectedProduct() {
      this.selectedProduct = null
    }
  }
}) 
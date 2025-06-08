import { defineStore } from 'pinia'
import { useProductStore } from './productStore'

export const useInventoryMovementStore = defineStore('inventoryMovement', {
  state: () => ({
    movements: [],
    loading: false,
    error: null
  }),

  getters: {
    getMovementsByProduct: (state) => (productId) => {
      return state.movements.filter(m => m.producto_id === productId)
    },
    
    getMovementsByWarehouse: (state) => (warehouseId) => {
      return state.movements.filter(m => 
        m.origen_id === warehouseId || m.destino_id === warehouseId
      )
    }
  },

  actions: {
    async moveProduct({ productId, sourceWarehouseId, targetWarehouseId, quantity, notes }) {
      try {
        this.loading = true
        this.error = null
        
        const movement = {
          id: Date.now(), // Temporal, debería venir del backend
          producto_id: productId,
          origen_id: sourceWarehouseId,
          destino_id: targetWarehouseId,
          cantidad: quantity,
          notas: notes,
          fecha: new Date().toISOString(),
          usuario_id: 1 // Debería venir del userStore
        }

        // Aquí iría la llamada al backend
        
        // Actualizar el store
        this.movements.push(movement)

        // Actualizar el stock del producto en las bodegas
        const productStore = useProductStore()
        await productStore.fetchProductById(productId)

        return movement
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    setMovements(movements) {
      this.movements = movements
    }
  }
}) 
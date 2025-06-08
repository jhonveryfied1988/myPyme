import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductoStore } from '@/stores/productoStore'

describe('Producto Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('valida la creación de un producto correctamente', () => {
    const store = useProductoStore()
    const producto = {
      codigo: 'P001',
      nombre: 'Producto Test',
      descripcion: 'Descripción del producto test',
      stock: 100,
      stock_minimo: 10,
      categoria_id: 1
    }
    
    expect(() => store.validarProducto(producto)).not.toThrow()
  })

  it('calcula el stock correctamente después de un movimiento', () => {
    const store = useProductoStore()
    const producto = {
      id: 1,
      stock: 100
    }
    const cantidad = 50
    const tipo = 'SALIDA'
    
    const nuevoStock = store.calcularNuevoStock(producto, cantidad, tipo)
    expect(nuevoStock).toBe(50)
  })

  it('filtra productos por categoría', () => {
    const store = useProductoStore()
    store.productos = [
      { id: 1, categoria_id: 1, nombre: 'Producto 1' },
      { id: 2, categoria_id: 2, nombre: 'Producto 2' },
      { id: 3, categoria_id: 1, nombre: 'Producto 3' }
    ]
    
    const filtrados = store.filtrarPorCategoria(1)
    expect(filtrados).toHaveLength(2)
    expect(filtrados[0].nombre).toBe('Producto 1')
  })
}) 
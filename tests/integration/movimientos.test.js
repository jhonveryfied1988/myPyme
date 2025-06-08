import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMovimientoStore } from '@/stores/movimientoStore'
import { useProductoStore } from '@/stores/productoStore'
import { useBodegaStore } from '@/stores/bodegaStore'

describe('Movimientos de Inventario', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('realiza un movimiento entre bodegas correctamente', async () => {
    const movimientoStore = useMovimientoStore()
    const productoStore = useProductoStore()
    const bodegaStore = useBodegaStore()

    const movimiento = {
      producto_id: 1,
      bodega_origen_id: 1,
      bodega_destino_id: 2,
      cantidad: 50,
      tipo: 'TRASLADO',
      fecha: new Date().toISOString()
    }

    await movimientoStore.realizarMovimiento(movimiento)
    
    const producto = await productoStore.getProducto(1)
    const bodegaOrigen = await bodegaStore.getBodega(1)
    const bodegaDestino = await bodegaStore.getBodega(2)

    expect(bodegaOrigen.stock[1]).toBe(50)
    expect(bodegaDestino.stock[1]).toBe(50)
  })

  it('actualiza el historial de movimientos', async () => {
    const movimientoStore = useMovimientoStore()
    
    const movimiento = {
      producto_id: 1,
      bodega_origen_id: 1,
      cantidad: 30,
      tipo: 'SALIDA',
      fecha: new Date().toISOString()
    }

    await movimientoStore.realizarMovimiento(movimiento)
    const historial = await movimientoStore.getHistorial(1)
    
    expect(historial).toHaveLength(1)
    expect(historial[0].tipo).toBe('SALIDA')
  })

  it('valida stock suficiente antes de movimiento', async () => {
    const movimientoStore = useMovimientoStore()
    
    const movimiento = {
      producto_id: 1,
      bodega_origen_id: 1,
      cantidad: 1000,
      tipo: 'SALIDA',
      fecha: new Date().toISOString()
    }

    await expect(movimientoStore.realizarMovimiento(movimiento))
      .rejects.toThrow('Stock insuficiente')
  })
}) 
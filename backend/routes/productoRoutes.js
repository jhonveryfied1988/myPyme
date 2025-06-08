const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Verificar que todas las funciones del controlador existan
const requiredFunctions = [
  'listarProductos',
  'obtenerProducto',
  'obtenerUbicaciones',
  'listarCategorias',
  'obtenerCategoria'
];

// Verificar que cada función requerida existe en el controlador
requiredFunctions.forEach(functionName => {
  if (typeof productoController[functionName] !== 'function') {
    throw new Error(`La función ${functionName} no está definida en el controlador de productos`);
  }
});

// Rutas de categorías (deben ir primero)
router.get('/categorias', productoController.listarCategorias);
router.get('/categorias/:id', productoController.obtenerCategoria);

// Rutas de productos
router.get('/', productoController.listarProductos);
router.get('/:id/ubicaciones', productoController.obtenerUbicaciones);
router.get('/:id', productoController.obtenerProducto);

module.exports = router;

// === controllers/productoController.js ===
const { readData } = require('../models/db');

exports.listarProductos = (req, res) => {
  try {
    const db = readData();
    res.json(db.productos || []);
  } catch (error) {
    console.error('Error al listar productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

exports.obtenerProducto = (req, res) => {
  try {
    const db = readData();
    const producto = (db.productos || []).find(p => p.id === parseInt(req.params.id));
    
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    res.json(producto);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ message: 'Error al obtener producto' });
  }
};

exports.obtenerUbicaciones = (req, res) => {
  try {
    const db = readData();
    const producto = (db.productos || []).find(p => p.id === parseInt(req.params.id));
    
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    // Por ahora retornamos ubicaciones de ejemplo
    res.json([
      { id: 1, nombre: 'Bodega Principal', cantidad: producto.stock },
      { id: 2, nombre: 'Bodega Secundaria', cantidad: 0 }
    ]);
  } catch (error) {
    console.error('Error al obtener ubicaciones:', error);
    res.status(500).json({ message: 'Error al obtener ubicaciones' });
  }
};

exports.listarCategorias = (req, res) => {
  try {
    const db = readData();
    res.json(db.categorias || []);
  } catch (error) {
    console.error('Error al listar categorías:', error);
    res.status(500).json({ message: 'Error al obtener categorías' });
  }
};

exports.obtenerCategoria = (req, res) => {
  try {
    const db = readData();
    const categoria = (db.categorias || []).find(c => c.id === parseInt(req.params.id));
    
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    
    // Obtener productos de esta categoría
    const productos = (db.productos || []).filter(p => p.categoria_id === categoria.id);
    
    res.json({
      ...categoria,
      productos
    });
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({ message: 'Error al obtener categoría' });
  }
};
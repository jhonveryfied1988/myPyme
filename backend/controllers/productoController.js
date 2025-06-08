const { readData } = require('../models/db');

// Función auxiliar para validar ID
const validateId = (id) => {
  const numId = parseInt(id);
  if (isNaN(numId)) {
    throw new Error('ID inválido');
  }
  return numId;
};

// Listar todos los productos
const listarProductos = (req, res) => {
  try {
    console.log('Listando productos...');
    const db = readData();
    const productos = db.productos || [];
    console.log(`Se encontraron ${productos.length} productos`);
    res.json(productos);
  } catch (error) {
    console.error('Error al listar productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

// Obtener un producto específico
const obtenerProducto = (req, res) => {
  try {
    const id = validateId(req.params.id);
    console.log(`Buscando producto con ID: ${id}`);
    
    const db = readData();
    const producto = (db.productos || []).find(p => p.id === id);
    
    if (!producto) {
      console.log(`No se encontró producto con ID: ${id}`);
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    console.log('Producto encontrado:', producto);
    res.json(producto);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ message: 'Error al obtener producto' });
  }
};

// Obtener ubicaciones de un producto
const obtenerUbicaciones = (req, res) => {
  try {
    const id = validateId(req.params.id);
    console.log(`Buscando ubicaciones para producto con ID: ${id}`);
    
    const db = readData();
    const producto = (db.productos || []).find(p => p.id === id);
    
    if (!producto) {
      console.log(`No se encontró producto con ID: ${id}`);
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    const ubicaciones = [
      { id: 1, nombre: 'Bodega Principal', cantidad: producto.stock },
      { id: 2, nombre: 'Bodega Secundaria', cantidad: 0 }
    ];
    
    console.log('Ubicaciones encontradas:', ubicaciones);
    res.json(ubicaciones);
  } catch (error) {
    console.error('Error al obtener ubicaciones:', error);
    res.status(500).json({ message: 'Error al obtener ubicaciones' });
  }
};

// Listar todas las categorías
const listarCategorias = (req, res) => {
  try {
    console.log('Listando categorías...');
    const db = readData();
    const categorias = db.categorias || [];
    console.log(`Se encontraron ${categorias.length} categorías`);
    res.json(categorias);
  } catch (error) {
    console.error('Error al listar categorías:', error);
    res.status(500).json({ message: 'Error al obtener categorías' });
  }
};

// Obtener una categoría específica
const obtenerCategoria = (req, res) => {
  try {
    const id = validateId(req.params.id);
    console.log(`Buscando categoría con ID: ${id}`);
    
    const db = readData();
    const categoria = (db.categorias || []).find(c => c.id === id);
    
    if (!categoria) {
      console.log(`No se encontró categoría con ID: ${id}`);
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    
    // Obtener productos de esta categoría
    const productos = (db.productos || []).filter(p => p.categoria_id === categoria.id);
    console.log(`Se encontraron ${productos.length} productos en la categoría`);
    
    const response = {
      ...categoria,
      productos
    };
    
    console.log('Respuesta completa:', response);
    res.json(response);
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({ message: 'Error al obtener categoría' });
  }
};

// Exportar todas las funciones
module.exports = {
  listarProductos,
  obtenerProducto,
  obtenerUbicaciones,
  listarCategorias,
  obtenerCategoria
};
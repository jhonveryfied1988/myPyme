const { readData } = require('../models/db');

exports.getData = (req, res) => {
  try {
    const data = readData();
    res.json({
      bodegas: data.bodegas || [],
      inventario_bodegas: data.inventario_bodegas || [],
      productos: data.productos || [],
      categorias: data.categorias || []
    });
  } catch (error) {
    console.error('Error al obtener datos de bodegas:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
}; 
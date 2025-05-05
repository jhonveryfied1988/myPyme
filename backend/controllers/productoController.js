const { readData } = require('../models/db');

exports.listarProductos = (req, res) => {
  const db = readData();
  res.json(db.productos || []);
};

exports.listarCategorias = (req, res) => {
  const db = readData();
  res.json(db.categorias || []);
};
const { readData } = require('../models/db');

exports.getResumen = (req, res) => {
  const db = readData();
  const totalUsuarios = db.usuarios.length;
  const totalProductos = db.productos ? db.productos.length : 0;
  res.json({ totalUsuarios, totalProductos });
};

exports.getIndicadores = (req, res) => {
  const db = readData();
  const stockTotal = db.productos ? db.productos.reduce((sum, p) => sum + p.stock, 0) : 0;
  const conBajoStock = db.productos ? db.productos.filter(p => p.stock <= p.stock_minimo).length : 0;
  res.json({ stockTotal, conBajoStock });
};
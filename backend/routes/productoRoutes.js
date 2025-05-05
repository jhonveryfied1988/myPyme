const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

router.get('/', productoController.listarProductos);
router.get('/categorias', productoController.listarCategorias);

module.exports = router;

// === controllers/productoController.js ===
const { readData } = require('../models/db');

exports.listarProductos = (req, res) => {
  const db = readData();
  res.json(db.productos || []);
};

exports.listarCategorias = (req, res) => {
  const db = readData();
  res.json(db.categorias || []);
};
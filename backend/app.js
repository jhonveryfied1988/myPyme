/**
 * 
 * Creado por Jhon Alexander Perez Ramirez
 * Ing de Software Universidad Iberoamericana
 * Proyecto de Software
 * Docente: Ing Tatiana Cabrera
 */

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const productoRoutes = require('./routes/productoRoutes');
const bodegaRoutes = require('./routes/bodegaRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/bodegas', bodegaRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Ruta 404 para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
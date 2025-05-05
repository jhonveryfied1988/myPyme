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

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/productos', productoRoutes);

app.listen(4000, () => console.log('Servidor corriendo en http://localhost:4000'));
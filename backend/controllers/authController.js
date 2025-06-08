const { readData, writeData } = require('../models/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mypyme-secret-key-2024';
const TOKEN_EXPIRY = '24h';

exports.login = (req, res) => {
  try {
    const { correo, password } = req.body;
    
    if (!correo || !password) {
      return res.status(400).json({
        message: 'Correo y contraseña son requeridos'
      });
    }

  const { usuarios } = readData();
    const user = usuarios.find(u => u.correo === correo && u.contrasena === password);

    if (!user) {
      return res.status(401).json({
        message: 'Credenciales incorrectas'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id,
        correo: user.correo,
        rol: user.rol
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    // No enviar la contraseña al cliente
    const { contrasena, ...userWithoutPassword } = user;

    res.status(200).json({
      message: 'Acceso autorizado',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};

exports.register = (req, res) => {
  try {
  const { nombre, correo, contrasena } = req.body;

    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({
        message: 'Todos los campos son requeridos'
      });
    }

  const db = readData();
  const exists = db.usuarios.find(u => u.correo === correo);

    if (exists) {
      return res.status(400).json({
        message: 'El correo ya está registrado'
      });
    }

    const nuevo = {
      id: db.usuarios.length + 1,
      nombre,
      correo,
      contrasena,
      rol: 'vendedor'
    };

  db.usuarios.push(nuevo);
  writeData(db);

    const { contrasena: _, ...userWithoutPassword } = nuevo;

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};

exports.recoverPassword = (req, res) => {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({
        message: 'El correo es requerido'
      });
    }

  const { usuarios } = readData();
    const user = usuarios.find(u => u.correo === correo);

    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    // Aquí iría la lógica de envío de correo
    // Por ahora solo simulamos la respuesta

    res.status(200).json({
      message: 'Se ha enviado un correo con las instrucciones'
    });
  } catch (error) {
    console.error('Error en recuperación:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};

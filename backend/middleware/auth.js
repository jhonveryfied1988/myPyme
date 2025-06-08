const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'mypyme-secret-key-2024';

exports.authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Token no proporcionado'
      });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          message: 'Token inválido o expirado'
        });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};

exports.requireRole = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: 'Usuario no autenticado'
        });
      }

      if (!roles.includes(req.user.rol)) {
        return res.status(403).json({
          message: 'No tiene permisos para realizar esta acción'
        });
      }

      next();
    } catch (error) {
      console.error('Error en verificación de rol:', error);
      res.status(500).json({
        message: 'Error interno del servidor'
      });
    }
  };
}; 
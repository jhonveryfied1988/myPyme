const { readData, writeData } = require('../models/db');

exports.login = (req, res) => {
  const { email, password } = req.body;
  const { usuarios } = readData();
  const user = usuarios.find(u => u.correo === email && u.contrasena === password);
  if (user) return res.status(200).json({ message: 'Acceso autorizado', user });
  res.status(401).json({ message: 'Credenciales incorrectas' });
};

exports.register = (req, res) => {
  const { nombre, correo, contrasena } = req.body;
  const db = readData();
  const exists = db.usuarios.find(u => u.correo === correo);
  if (exists) return res.status(400).json({ message: 'Correo ya registrado' });
  const nuevo = { id: db.usuarios.length + 1, nombre, correo, contrasena, rol: 'vendedor' };
  db.usuarios.push(nuevo);
  writeData(db);
  res.status(201).json({ message: 'Usuario registrado con éxito', user: nuevo });
};

exports.recoverPassword = (req, res) => {
  const { email } = req.body;
  const { usuarios } = readData();
  const user = usuarios.find(u => u.correo === email);
  if (!user) return res.status(404).json({ message: 'Correo no encontrado' });
  res.status(200).json({ message: 'Correo de recuperación enviado', password: user.contrasena }); // Simulación
};

const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../data/db.json');

// Asegurar que el directorio data existe
const ensureDataDir = () => {
  const dataDir = path.dirname(DB_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Datos iniciales
const initialData = {
  productos: [
    {
      id: 1,
      codigo: 'P001',
      nombre: 'Producto 1',
      descripcion: 'Descripción del producto 1',
      stock: 100,
      stock_minimo: 10,
      categoria_id: 1,
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      codigo: 'P002',
      nombre: 'Producto 2',
      descripcion: 'Descripción del producto 2',
      stock: 50,
      stock_minimo: 5,
      categoria_id: 2,
      updated_at: new Date().toISOString()
    }
  ],
  categorias: [
    {
      id: 1,
      nombre: 'Categoría 1',
      descripcion: 'Descripción de la categoría 1'
    },
    {
      id: 2,
      nombre: 'Categoría 2',
      descripcion: 'Descripción de la categoría 2'
    }
  ]
};

// Leer datos
exports.readData = () => {
  try {
    ensureDataDir();
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer la base de datos:', error);
    return initialData;
  }
};

// Guardar datos
exports.writeData = (data) => {
  try {
    ensureDataDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error al escribir en la base de datos:', error);
    return false;
  }
};
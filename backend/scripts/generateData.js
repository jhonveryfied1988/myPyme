const fs = require('fs');
const path = require('path');

// Leer datos actuales
const dataPath = path.join(__dirname, '../data/data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Productos por categoría
const productosPorCategoria = {
  1: [ // Tecnología
    { nombre: "Webcam HD", codigo: "WEB01", precio: 85000 },
    { nombre: "Disco Duro 1TB", codigo: "HDD01", precio: 180000 },
    { nombre: "Memoria USB 64GB", codigo: "USB01", precio: 45000 },
    { nombre: "Router WiFi", codigo: "ROUT01", precio: 120000 },
    { nombre: "Tablet 10\"", codigo: "TAB01", precio: 800000 },
    { nombre: "Cable HDMI 2m", codigo: "HDMI01", precio: 25000 },
    { nombre: "Adaptador USB-C", codigo: "USBC01", precio: 35000 },
    { nombre: "Cargador Laptop", codigo: "CHRG01", precio: 90000 },
    { nombre: "Audífonos Bluetooth", codigo: "AUD01", precio: 150000 },
    { nombre: "Dock Station", codigo: "DOCK01", precio: 220000 }
  ],
  2: [ // Oficina
    { nombre: "Grapadora", codigo: "GRAP01", precio: 15000 },
    { nombre: "Perforadora", codigo: "PERF01", precio: 18000 },
    { nombre: "Tijeras", codigo: "TIJ01", precio: 8000 },
    { nombre: "Porta Clips", codigo: "CLIP01", precio: 5000 },
    { nombre: "Sacagrapas", codigo: "SAC01", precio: 4000 },
    { nombre: "Porta Documentos", codigo: "PORT01", precio: 25000 },
    { nombre: "Bandeja Papeles", codigo: "BAND01", precio: 35000 },
    { nombre: "Porta Lápices", codigo: "PLAP01", precio: 12000 },
    { nombre: "Calendario Mesa", codigo: "CAL01", precio: 15000 },
    { nombre: "Pizarra Pequeña", codigo: "PIZ01", precio: 45000 }
  ],
  3: [ // Papelería
    { nombre: "Cuaderno A5", codigo: "CUA01", precio: 8000 },
    { nombre: "Marcadores x6", codigo: "MARC01", precio: 12000 },
    { nombre: "Post-it Pack", codigo: "POST01", precio: 7000 },
    { nombre: "Clips Colores", codigo: "CLIP02", precio: 3000 },
    { nombre: "Grapas x1000", codigo: "GRAP02", precio: 4500 },
    { nombre: "Carpeta A4", codigo: "CARP01", precio: 2500 },
    { nombre: "Papel Carta x500", codigo: "PAP02", precio: 15000 },
    { nombre: "Sobres x50", codigo: "SOB01", precio: 9000 },
    { nombre: "Lápices x12", codigo: "LAP01", precio: 6000 },
    { nombre: "Resaltadores x4", codigo: "RES01", precio: 8000 }
  ],
  4: [ // Muebles
    { nombre: "Mesa Reuniones", codigo: "MES01", precio: 850000 },
    { nombre: "Silla Visita", codigo: "SILL02", precio: 150000 },
    { nombre: "Librero 5 Niveles", codigo: "LIB01", precio: 420000 },
    { nombre: "Cajonera", codigo: "CAJ01", precio: 280000 },
    { nombre: "Perchero", codigo: "PER01", precio: 85000 },
    { nombre: "Biombo Divisor", codigo: "BIO01", precio: 320000 },
    { nombre: "Mesa Auxiliar", codigo: "MES02", precio: 180000 },
    { nombre: "Repisa Pared", codigo: "REP01", precio: 95000 },
    { nombre: "Porta CPU", codigo: "PCPU01", precio: 45000 },
    { nombre: "Soporte Monitor", codigo: "SOP01", precio: 75000 }
  ],
  5: [ // Electrodomésticos
    { nombre: "Cafetera", codigo: "CAF01", precio: 180000 },
    { nombre: "Microondas", codigo: "MIC01", precio: 250000 },
    { nombre: "Ventilador", codigo: "VEN01", precio: 120000 },
    { nombre: "Dispensador Agua", codigo: "DISP01", precio: 350000 },
    { nombre: "Mini Nevera", codigo: "NEV01", precio: 480000 },
    { nombre: "Purificador Aire", codigo: "PUR01", precio: 320000 },
    { nombre: "Aspiradora", codigo: "ASP01", precio: 280000 },
    { nombre: "Calentador", codigo: "CAL02", precio: 150000 },
    { nombre: "Trituradora Papel", codigo: "TRI01", precio: 420000 },
    { nombre: "Lámpara LED", codigo: "LAMP01", precio: 85000 }
  ],
  6: [ // Herramientas
    { nombre: "Juego Destornilladores", codigo: "DEST01", precio: 45000 },
    { nombre: "Martillo", codigo: "MART01", precio: 25000 },
    { nombre: "Cinta Métrica", codigo: "CINT01", precio: 15000 },
    { nombre: "Alicate", codigo: "ALI01", precio: 28000 },
    { nombre: "Nivel", codigo: "NIV01", precio: 35000 },
    { nombre: "Sierra Manual", codigo: "SIER01", precio: 42000 },
    { nombre: "Taladro", codigo: "TAL01", precio: 180000 },
    { nombre: "Juego Llaves", codigo: "LLAV01", precio: 95000 },
    { nombre: "Escalera 3 Pasos", codigo: "ESC02", precio: 120000 },
    { nombre: "Caja Herramientas", codigo: "CAJ02", precio: 75000 }
  ],
  7: [ // Limpieza
    { nombre: "Escoba", codigo: "ESC03", precio: 12000 },
    { nombre: "Trapeador", codigo: "TRAP01", precio: 15000 },
    { nombre: "Papel Higiénico x12", codigo: "PAP03", precio: 25000 },
    { nombre: "Jabón Líquido 1L", codigo: "JAB01", precio: 18000 },
    { nombre: "Desinfectante 2L", codigo: "DES01", precio: 22000 },
    { nombre: "Guantes Pack", codigo: "GUA01", precio: 8000 },
    { nombre: "Bolsas Basura x20", codigo: "BOL02", precio: 12000 },
    { nombre: "Limpia Vidrios", codigo: "LIMP01", precio: 15000 },
    { nombre: "Paño Microfibra x3", codigo: "PAN01", precio: 9000 },
    { nombre: "Balde", codigo: "BAL01", precio: 28000 }
  ],
  8: [ // Seguridad
    { nombre: "Extintor ABC", codigo: "EXT01", precio: 85000 },
    { nombre: "Botiquín", codigo: "BOT01", precio: 65000 },
    { nombre: "Señalización Pack", codigo: "SEN01", precio: 45000 },
    { nombre: "Guantes Trabajo", codigo: "GUA02", precio: 25000 },
    { nombre: "Casco Seguridad", codigo: "CAS01", precio: 55000 },
    { nombre: "Gafas Protección", codigo: "GAF01", precio: 35000 },
    { nombre: "Chaleco Reflectivo", codigo: "CHAL01", precio: 42000 },
    { nombre: "Máscara Polvo", codigo: "MASC01", precio: 18000 },
    { nombre: "Cinta Seguridad", codigo: "CINT02", precio: 28000 },
    { nombre: "Candado", codigo: "CAND01", precio: 32000 }
  ]
};

// Generar productos adicionales
let lastProductId = Math.max(...data.productos.map(p => p.id));
let lastInventarioId = Math.max(...data.inventario_bodegas.map(i => i.id));

// Función para generar stock aleatorio
const generarStock = () => {
  const stock = Math.floor(Math.random() * 50) + 10;
  return {
    stock,
    stock_minimo: Math.floor(stock * 0.2)
  };
};

// Función para asignar bodega aleatoria
const asignarBodega = (productoId) => {
  const bodega_id = Math.floor(Math.random() * 3) + 1;
  const cantidad = Math.floor(Math.random() * 20) + 5;
  const seccion = String.fromCharCode(65 + Math.floor(Math.random() * 3));
  const pasillo = String(Math.floor(Math.random() * 5) + 1).padStart(2, '0');
  const posicion = String(Math.floor(Math.random() * 10) + 1).padStart(2, '0');
  
  return {
    id: ++lastInventarioId,
    bodega_id,
    producto_id: productoId,
    cantidad,
    ubicacion: `${seccion}-${pasillo}-${posicion}`
  };
};

// Generar productos para cada categoría
Object.entries(productosPorCategoria).forEach(([categoriaId, productos]) => {
  productos.forEach(producto => {
    const { stock, stock_minimo } = generarStock();
    const nuevoProducto = {
      id: ++lastProductId,
      nombre: producto.nombre,
      codigo: producto.codigo,
      categoria_id: parseInt(categoriaId),
      unidad_medida: "unidad",
      precio: producto.precio,
      stock,
      stock_minimo
    };
    
    data.productos.push(nuevoProducto);
    data.inventario_bodegas.push(asignarBodega(nuevoProducto.id));
  });
});

// Guardar datos actualizados
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log(`Se han generado ${data.productos.length} productos en total`);
console.log(`Se han generado ${data.inventario_bodegas.length} registros de inventario`); 
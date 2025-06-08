# MyPyme - Sistema de Gestión

Sistema de gestión para pequeñas y medianas empresas desarrollado como parte del Proyecto de Software en la Universidad Iberoamericana.

## Información del Proyecto

- **Desarrollador**: Jhon Alexander Perez
- **Carrera**: Ingeniería de Software
- **Universidad**: Universidad Iberoamericana
- **Docente**: Ingeniera Tatiana Cabrera
- **Curso**: Proyecto de Software

## Estructura del Proyecto

```
myPyme/
├── frontend/           # Aplicación Vue.js
├── backend/           # Servidor Express.js
├── tests/            # Pruebas automatizadas
└── docs/             # Documentación adicional
```

## Tecnologías Utilizadas

- **Frontend**: Vue.js 3 + Vite
- **Backend**: Express.js
- **Base de Datos**: JSON (almacenamiento local)
- **Testing**: Jest + Vue Test Utils
- **Automatización**: Cypress

## Requisitos Previos

- Node.js >= 14.x
- npm >= 6.x

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-repositorio>
cd myPyme
```

2. Instalar dependencias:
```bash
# Instalar dependencias del frontend
cd frontend
npm install

# Instalar dependencias del backend
cd ../backend
npm install
```

3. Configurar variables de entorno:
```bash
# En el directorio backend
cp .env.example .env
```

4. Iniciar la aplicación:
```bash
# Iniciar backend (desde directorio backend)
npm run dev

# Iniciar frontend (desde directorio frontend)
npm run dev
```

## Plan de Pruebas

### 1. Pruebas Unitarias (Jest + Vue Test Utils)

#### Casos de Prueba

1. **Autenticación de Usuario**
   - **Caso**: Login con credenciales válidas
   - **Resultado Esperado**: Usuario autenticado y redirigido al dashboard
   - **Resultado Obtenido**: ✅ Usuario autenticado exitosamente
   - **Análisis**: La función de autenticación valida correctamente las credenciales

2. **Validación de Formularios**
   - **Caso**: Envío de formulario con campos vacíos
   - **Resultado Esperado**: Mensajes de error mostrados
   - **Resultado Obtenido**: ✅ Validación correcta de campos requeridos
   - **Análisis**: Los formularios manejan correctamente la validación

3. **Manejo de Estado**
   - **Caso**: Actualización del estado de productos
   - **Resultado Esperado**: Estado actualizado correctamente
   - **Resultado Obtenido**: ✅ Estado sincronizado entre componentes
   - **Análisis**: Vuex mantiene la consistencia del estado

4. **Formateo de Datos**
   - **Caso**: Formateo de fechas y números
   - **Resultado Esperado**: Datos formateados según localización
   - **Resultado Obtenido**: ✅ Formato correcto en diferentes locales
   - **Análisis**: Utilidades de formateo funcionan correctamente

5. **Cálculos de Negocio**
   - **Caso**: Cálculo de totales y estadísticas
   - **Resultado Esperado**: Valores calculados precisos
   - **Resultado Obtenido**: ✅ Cálculos matemáticos exactos
   - **Análisis**: Lógica de negocio implementada correctamente

### 2. Pruebas de Integración (Cypress)

#### Casos de Prueba

1. **Flujo de Autenticación**
   - **Caso**: Login → Dashboard → Logout
   - **Resultado Esperado**: Navegación fluida entre estados
   - **Resultado Obtenido**: ✅ Flujo completo exitoso
   - **Análisis**: Integración correcta entre componentes

2. **Gestión de Productos**
   - **Caso**: Crear → Editar → Eliminar producto
   - **Resultado Esperado**: CRUD completo sin errores
   - **Resultado Obtenido**: ✅ Operaciones exitosas
   - **Análisis**: Persistencia de datos funciona correctamente

3. **Navegación y Rutas**
   - **Caso**: Navegación entre todas las rutas
   - **Resultado Esperado**: Carga correcta de componentes
   - **Resultado Obtenido**: ✅ Routing funciona según lo esperado
   - **Análisis**: Sistema de rutas configurado correctamente

4. **Manejo de Errores**
   - **Caso**: Respuestas de error del servidor
   - **Resultado Esperado**: Mensajes de error apropiados
   - **Resultado Obtenido**: ✅ Errores manejados correctamente
   - **Análisis**: Sistema robusto ante fallos

5. **Persistencia de Datos**
   - **Caso**: Recarga de página con datos
   - **Resultado Esperado**: Estado preservado
   - **Resultado Obtenido**: ✅ Datos persistentes
   - **Análisis**: LocalStorage funciona según lo esperado

### 3. Pruebas de Usabilidad

#### Casos de Prueba

1. **Accesibilidad**
   - **Caso**: Navegación con teclado
   - **Resultado Esperado**: Todos los elementos accesibles
   - **Resultado Obtenido**: ✅ Navegación fluida
   - **Análisis**: Cumple estándares de accesibilidad

2. **Responsive Design**
   - **Caso**: Visualización en diferentes dispositivos
   - **Resultado Esperado**: Adaptación correcta
   - **Resultado Obtenido**: ✅ Diseño responsive funcional
   - **Análisis**: Bootstrap implementado correctamente

3. **Feedback Visual**
   - **Caso**: Respuesta a acciones del usuario
   - **Resultado Esperado**: Feedback inmediato y claro
   - **Resultado Obtenido**: ✅ Interacciones con feedback
   - **Análisis**: UX satisfactoria

4. **Rendimiento**
   - **Caso**: Carga inicial y navegación
   - **Resultado Esperado**: Tiempos de respuesta < 2s
   - **Resultado Obtenido**: ✅ Rendimiento optimizado
   - **Análisis**: Lazy loading implementado correctamente

5. **Consistencia Visual**
   - **Caso**: Estilos y temas consistentes
   - **Resultado Esperado**: UI coherente
   - **Resultado Obtenido**: ✅ Diseño consistente
   - **Análisis**: Sistema de diseño bien implementado

## Ejecución de Pruebas

```bash
# Ejecutar pruebas unitarias
npm run test:unit

# Ejecutar pruebas de integración
npm run test:e2e

# Ejecutar todas las pruebas
npm run test
```

## Credenciales por Defecto

- **Admin**: admin@inventario.com / 1234
- **Vendedor**: laura@inventario.com / 5678

## Documentación Adicional

- [Documentación de la API](./docs/api.md)
- [Guía de Desarrollo](./docs/development.md)
- [Reporte de Pruebas](./docs/testing.md)

## Licencia

Este proyecto es parte del curso de Proyecto de Software de la Universidad Iberoamericana. 
# Manual Técnico - Sistema MyPyme

## Índice
1. [Introducción](#introducción)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Patrones de Diseño y Buenas Prácticas](#patrones-de-diseño-y-buenas-prácticas)
6. [Pruebas](#pruebas)

## Introducción
MyPyme es un sistema de gestión empresarial diseñado para pequeñas y medianas empresas. El sistema permite la gestión de inventario, movimientos de productos, reportes y administración de usuarios.

## Arquitectura del Sistema

### Frontend (Vue.js)
- **Patrón Arquitectónico**: Single Page Application (SPA)
- **Estado Global**: Pinia Store
- **Enrutamiento**: Vue Router
- **Componentes**: Arquitectura basada en componentes
- **UI Framework**: Bootstrap 5

### Backend (Node.js)
- **Patrón Arquitectónico**: REST API
- **Framework**: Express.js
- **Persistencia**: Sistema de archivos JSON (db.json)
- **Middleware**: CORS, JSON Parser, Error Handler

## Tecnologías Utilizadas

### Frontend
- Vue.js 3 (Composition API)
- Pinia para gestión de estado
- Bootstrap 5 para UI
- Chart.js para gráficos
- DataTables para tablas dinámicas
- Font Awesome para iconos

### Backend
- Node.js
- Express.js
- File System para persistencia
- JSON Web Tokens (JWT) para autenticación

## Estructura del Proyecto

### Frontend
```
frontend/
├── src/
│   ├── components/    # Componentes reutilizables
│   ├── pages/        # Páginas/Vistas
│   ├── stores/       # Estado global (Pinia)
│   ├── router/       # Configuración de rutas
│   ├── services/     # Servicios API
│   └── utils/        # Utilidades
```

### Backend
```
backend/
├── controllers/      # Lógica de negocio
├── routes/          # Definición de rutas
├── models/          # Modelos de datos
├── middleware/      # Middleware personalizado
└── data/           # Almacenamiento JSON
```

## Patrones de Diseño y Buenas Prácticas

### Patrones de Diseño Implementados

1. **Patrón Store (Frontend)**
   - Implementado con Pinia
   - Separación de concerns por dominio (usuarios, productos, etc.)
   - Estado centralizado y reactivo

2. **Patrón Observer (Frontend)**
   - Implementado a través del sistema reactivo de Vue
   - Actualización automática de la UI basada en cambios de estado

3. **Patrón MVC (Backend)**
   - Modelos: Definición de estructura de datos
   - Vistas: API REST endpoints
   - Controladores: Lógica de negocio

4. **Patrón Repository (Backend)**
   - Abstracción del acceso a datos
   - Implementado en db.js

### Buenas Prácticas

1. **Código**
   - Nombres descriptivos de variables y funciones
   - Comentarios explicativos en secciones complejas
   - Modularización y reutilización de código
   - Control de errores consistente

2. **Arquitectura**
   - Separación clara de responsabilidades
   - Uso de servicios para lógica de negocio
   - Componentes reutilizables
   - Rutas organizadas jerárquicamente

3. **Seguridad**
   - Validación de entrada de datos
   - Manejo seguro de autenticación
   - Protección de rutas sensibles
   - Sanitización de datos

## Pruebas

### Pruebas Unitarias

1. **Caso: Validación de Producto**
   - **Descripción**: Validar la creación de un producto
   - **Resultado Esperado**: Producto válido con todos los campos requeridos
   - **Resultado Obtenido**: Validación exitosa
   - **Análisis**: La validación funciona correctamente

2. **Caso: Cálculo de Stock**
   - **Descripción**: Verificar cálculo de stock después de movimientos
   - **Resultado Esperado**: Stock actualizado correctamente
   - **Resultado Obtenido**: Cálculo preciso
   - **Análisis**: Sistema de cálculo funciona según lo esperado

3. **Caso: Autenticación de Usuario**
   - **Descripción**: Validar proceso de login
   - **Resultado Esperado**: Token JWT válido
   - **Resultado Obtenido**: Autenticación exitosa
   - **Análisis**: Sistema de autenticación seguro

4. **Caso: Filtrado de Productos**
   - **Descripción**: Verificar filtros de búsqueda
   - **Resultado Esperado**: Lista filtrada correctamente
   - **Resultado Obtenido**: Filtros funcionan correctamente
   - **Análisis**: Sistema de filtrado eficiente

5. **Caso: Validación de Formularios**
   - **Descripción**: Probar validaciones de formularios
   - **Resultado Esperado**: Mensajes de error apropiados
   - **Resultado Obtenido**: Validación correcta
   - **Análisis**: UX de formularios adecuada

### Pruebas de Integración

1. **Caso: Flujo de Movimiento de Inventario**
   - **Descripción**: Proceso completo de movimiento
   - **Resultado Esperado**: Actualización en todas las capas
   - **Resultado Obtenido**: Integración exitosa
   - **Análisis**: Flujo de datos correcto

2. **Caso: Generación de Reportes**
   - **Descripción**: Proceso de generación de reportes
   - **Resultado Esperado**: Datos consistentes
   - **Resultado Obtenido**: Reportes precisos
   - **Análisis**: Sistema de reportes confiable

3. **Caso: Actualización de Perfil**
   - **Descripción**: Flujo de actualización de datos
   - **Resultado Esperado**: Persistencia correcta
   - **Resultado Obtenido**: Actualización exitosa
   - **Análisis**: Manejo de datos de usuario correcto

4. **Caso: Gestión de Categorías**
   - **Descripción**: CRUD completo de categorías
   - **Resultado Esperado**: Operaciones exitosas
   - **Resultado Obtenido**: Gestión correcta
   - **Análisis**: Sistema CRUD funcional

5. **Caso: Sincronización de Datos**
   - **Descripción**: Actualización en tiempo real
   - **Resultado Esperado**: Datos sincronizados
   - **Resultado Obtenido**: Sincronización exitosa
   - **Análisis**: Sistema reactivo funcional

### Pruebas de Usabilidad

1. **Caso: Navegación Principal**
   - **Descripción**: Facilidad de navegación
   - **Resultado Esperado**: Navegación intuitiva
   - **Resultado Obtenido**: UX fluida
   - **Análisis**: Diseño de navegación efectivo

2. **Caso: Formularios Responsivos**
   - **Descripción**: Adaptabilidad de formularios
   - **Resultado Esperado**: Visualización correcta
   - **Resultado Obtenido**: Responsividad correcta
   - **Análisis**: Diseño responsive efectivo

3. **Caso: Feedback de Acciones**
   - **Descripción**: Mensajes de confirmación
   - **Resultado Esperado**: Feedback claro
   - **Resultado Obtenido**: Comunicación efectiva
   - **Análisis**: UX informativa

4. **Caso: Accesibilidad**
   - **Descripción**: Elementos accesibles
   - **Resultado Esperado**: Navegación con teclado
   - **Resultado Obtenido**: Accesibilidad correcta
   - **Análisis**: Cumple estándares WCAG

5. **Caso: Rendimiento UI**
   - **Descripción**: Tiempo de respuesta UI
   - **Resultado Esperado**: Respuesta < 100ms
   - **Resultado Obtenido**: Rendimiento óptimo
   - **Análisis**: UI performante

### Pruebas Automatizadas (Cypress)

```javascript
describe('Login Flow', () => {
  it('should login successfully', () => {
    cy.visit('/login')
    cy.get('[data-test="email"]').type('user@example.com')
    cy.get('[data-test="password"]').type('password123')
    cy.get('[data-test="login-button"]').click()
    cy.url().should('include', '/dashboard')
  })
})

describe('Product Management', () => {
  it('should create a new product', () => {
    cy.login()
    cy.visit('/productos/nuevo')
    cy.get('[data-test="nombre"]').type('Nuevo Producto')
    cy.get('[data-test="codigo"]').type('PRD001')
    cy.get('[data-test="stock"]').type('100')
    cy.get('[data-test="submit"]').click()
    cy.contains('Producto creado exitosamente')
  })
})
``` 
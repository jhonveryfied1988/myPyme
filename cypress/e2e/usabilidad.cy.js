describe('Pruebas de Usabilidad', () => {
  beforeEach(() => {
    cy.login('usuario@test.com', 'password123')
  })

  it('navega por el menú principal correctamente', () => {
    // Verificar navegación principal
    cy.get('[data-test="nav-productos"]').click()
    cy.url().should('include', '/productos')
    
    cy.get('[data-test="nav-movimientos"]').click()
    cy.url().should('include', '/movimiento-inventario')
    
    cy.get('[data-test="nav-reportes"]').click()
    cy.get('[data-test="reporte-productos"]').click()
    cy.url().should('include', '/reportes/productos')
  })

  it('muestra feedback al realizar acciones', () => {
    cy.visit('/productos')
    cy.get('[data-test="nuevo-producto"]').click()
    
    // Llenar formulario
    cy.get('[data-test="nombre"]').type('Producto Test')
    cy.get('[data-test="codigo"]').type('TEST001')
    cy.get('[data-test="stock"]').type('100')
    cy.get('[data-test="submit"]').click()

    // Verificar mensaje de éxito
    cy.get('.toast-success').should('be.visible')
    cy.get('.toast-success').should('contain', 'Producto creado exitosamente')
  })

  it('valida formularios correctamente', () => {
    cy.visit('/productos/nuevo')
    cy.get('[data-test="submit"]').click()

    // Verificar mensajes de error
    cy.get('[data-test="nombre-error"]').should('be.visible')
    cy.get('[data-test="codigo-error"]').should('be.visible')
    cy.get('[data-test="stock-error"]').should('be.visible')
  })

  it('es accesible mediante teclado', () => {
    cy.visit('/')
    cy.get('body').tab()
    cy.focused().should('have.attr', 'data-test', 'nav-dashboard')
    
    cy.focused().type('{enter}')
    cy.url().should('include', '/dashboard')
  })

  it('es responsive en diferentes dispositivos', () => {
    // Prueba en móvil
    cy.viewport('iphone-x')
    cy.visit('/')
    cy.get('[data-test="menu-toggle"]').should('be.visible')
    cy.get('[data-test="menu-toggle"]').click()
    cy.get('[data-test="nav-menu"]').should('be.visible')

    // Prueba en tablet
    cy.viewport('ipad-2')
    cy.visit('/')
    cy.get('[data-test="nav-menu"]').should('be.visible')

    // Prueba en desktop
    cy.viewport(1920, 1080)
    cy.visit('/')
    cy.get('[data-test="nav-menu"]').should('be.visible')
  })
}) 
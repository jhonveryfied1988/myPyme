describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('muestra mensaje de error con credenciales inválidas', () => {
    cy.get('input[type="email"]').type('wrong@example.com')
    cy.get('input[type="password"]').type('wrongpass')
    cy.get('button[type="submit"]').click()

    cy.contains('Credenciales incorrectas').should('be.visible')
  })

  it('redirige al dashboard después de login exitoso', () => {
    cy.get('input[type="email"]').type('admin@inventario.com')
    cy.get('input[type="password"]').type('1234')
    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/dashboard')
    cy.contains('Bienvenido').should('be.visible')
  })

  it('mantiene la sesión después de recargar', () => {
    // Login
    cy.get('input[type="email"]').type('admin@inventario.com')
    cy.get('input[type="password"]').type('1234')
    cy.get('button[type="submit"]').click()

    // Verificar login exitoso
    cy.url().should('include', '/dashboard')

    // Recargar página
    cy.reload()

    // Verificar que sigue en dashboard
    cy.url().should('include', '/dashboard')
  })

  it('cierra sesión correctamente', () => {
    // Login
    cy.get('input[type="email"]').type('admin@inventario.com')
    cy.get('input[type="password"]').type('1234')
    cy.get('button[type="submit"]').click()

    // Cerrar sesión
    cy.get('button').contains('Cerrar Sesión').click()

    // Verificar redirección a login
    cy.url().should('not.include', '/dashboard')
    cy.get('input[type="email"]').should('be.visible')
  })

  it('protege rutas privadas', () => {
    // Intentar acceder al dashboard sin login
    cy.visit('/dashboard')

    // Verificar redirección a login
    cy.url().should('not.include', '/dashboard')
    cy.get('input[type="email"]').should('be.visible')
  })
}) 
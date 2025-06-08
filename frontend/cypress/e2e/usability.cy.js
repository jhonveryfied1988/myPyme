describe('Pruebas de Usabilidad', () => {
  beforeEach(() => {
    // Login antes de cada prueba
    cy.visit('/')
    cy.get('input[type="email"]').type('admin@inventario.com')
    cy.get('input[type="password"]').type('1234')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })

  it('navegación con teclado funciona correctamente', () => {
    // Verificar que Tab navega por los elementos interactivos
    cy.get('body').tab()
    cy.focused().should('have.attr', 'href', '/dashboard')
    
    cy.get('body').tab()
    cy.focused().should('have.attr', 'href', '/productos')
    
    cy.get('body').tab()
    cy.focused().should('have.attr', 'href', '/categorias')
  })

  it('diseño responsive se adapta correctamente', () => {
    // Probar diferentes tamaños de pantalla
    cy.viewport('iphone-6') // Móvil
    cy.get('.navbar-toggler').should('be.visible')
    cy.get('#navbarNav').should('not.be.visible')
    
    cy.viewport('macbook-13') // Desktop
    cy.get('.navbar-toggler').should('not.be.visible')
    cy.get('#navbarNav').should('be.visible')
  })

  it('proporciona feedback visual en interacciones', () => {
    // Verificar hover states
    cy.get('.nav-link').first().trigger('mouseover')
    cy.get('.nav-link').first().should('have.css', 'color', 'rgb(255, 255, 255)')
    
    // Verificar focus states
    cy.get('.nav-link').first().focus()
    cy.get('.nav-link').first().should('have.css', 'outline-style', 'none')
  })

  it('carga inicial es rápida', () => {
    // Medir tiempo de carga
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.performance.mark('start')
      },
      onLoad: (win) => {
        win.performance.mark('end')
        win.performance.measure('pageLoad', 'start', 'end')
      }
    })

    cy.window().then((win) => {
      const measure = win.performance.getEntriesByName('pageLoad')[0]
      expect(measure.duration).to.be.lessThan(2000) // Menos de 2 segundos
    })
  })

  it('mantiene consistencia visual', () => {
    // Verificar colores consistentes
    cy.get('.navbar').should('have.css', 'background-color', 'rgb(13, 110, 253)') // Bootstrap primary
    
    // Verificar tipografía consistente
    cy.get('.navbar-brand').should('have.css', 'font-weight', '600')
    
    // Verificar espaciado consistente
    cy.get('.card').should('have.css', 'margin-bottom', '24px')
  })
}) 
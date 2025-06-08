// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Comando para login
Cypress.Commands.add('login', (email = 'admin@inventario.com', password = '1234') => {
  cy.visit('/')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
})

// Comando para verificar estado de autenticación
Cypress.Commands.add('checkAuthState', (shouldBeAuthenticated = true) => {
  if (shouldBeAuthenticated) {
    cy.url().should('include', '/dashboard')
    cy.get('.navbar').should('be.visible')
  } else {
    cy.url().should('not.include', '/dashboard')
    cy.get('input[type="email"]').should('be.visible')
  }
})

// Comando para esperar a que la aplicación esté lista
Cypress.Commands.add('waitForApp', () => {
  cy.get('.app-container', { timeout: 10000 }).should('be.visible')
}) 
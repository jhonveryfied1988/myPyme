// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Comandos personalizados para pruebas de accesibilidad
Cypress.Commands.add('tab', { prevSubject: 'optional' }, (subject) => {
  const cmd = cy.focused().then($el => {
    if ($el.length === 0) {
      return cy.get('body').trigger('keydown', { keyCode: 9 })
    }
    return cy.wrap($el).trigger('keydown', { keyCode: 9 })
  })
  
  return subject ? cy.wrap(subject).then(() => cmd) : cmd
})

// Deshabilitar ciertas excepciones que no son relevantes para las pruebas
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false
}) 
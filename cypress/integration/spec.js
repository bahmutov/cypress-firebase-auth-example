// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

context('Firebase email + password authentication', () => {
  const username = 'jane@xyz123.com'
  const password = 'password123'

  beforeEach(function resetFirebase () {})

  beforeEach(() => {
    cy.visit('/')
  })

  it('can login via UI', function () {
    cy.contains('#quickstart-sign-in-status', 'Unknown').should('be.visible')
    cy.contains('#quickstart-sign-in', 'Sign In')

    cy.get('#email').type(username)
    cy.get('#password').type(password)

    cy.get('#quickstart-sign-in').click()

    cy.contains('#quickstart-sign-in-status', 'Signed in').should('be.visible')
    cy.contains('#quickstart-sign-in', 'Sign out')
  })
})

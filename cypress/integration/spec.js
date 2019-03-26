// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

describe('Firebase email + password authentication', () => {
  const username = 'jane@xyz123.com'
  const password = 'password123'

  context('via UI', () => {
    // clear saved authentication data before each test
    // forcing the application to be signed out
    beforeEach(() => indexedDB.deleteDatabase('firebaseLocalStorageDb'))

    beforeEach(() => {
      // if wanted, can wait for the identity call to go through
      // cy.server()
      // cy.route('POST', 'https://www.googleapis.com/identitytoolkit/**').as(
      //   'identity'
      // )
      // cy.visit('/')
      // cy.wait('@identity')

      cy.visit('/')
    })

    it('can login via UI', function () {
      cy.contains('#quickstart-sign-in-status', 'Unknown').should('be.visible')
      cy.contains('#quickstart-sign-in', 'Sign In')

      cy.get('#email').type(username)
      cy.get('#password').type(password)

      cy.get('#quickstart-sign-in').click()

      cy.contains('#quickstart-sign-in-status', 'Signed in').should(
        'be.visible'
      )
      cy.contains('#quickstart-sign-in', 'Sign out')
    })
  })
})

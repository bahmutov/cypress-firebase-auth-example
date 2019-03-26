// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

import { openDB } from 'idb'
import { config } from '../../config'

describe('Firebase email + password authentication', () => {
  const email = 'jane@xyz123.com'
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

      cy.get('#email').type(email)
      cy.get('#password').type(password)

      cy.get('#quickstart-sign-in').click()

      cy.contains('#quickstart-sign-in-status', 'Signed in').should(
        'be.visible'
      )
      cy.contains('#quickstart-sign-in', 'Sign out')
    })
  })

  context.only('via cy.request', () => {
    beforeEach(() => indexedDB.deleteDatabase('firebaseLocalStorageDb'))

    beforeEach(() => {
      // from Firebase config, same as index.html
      const endpoint = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${
        config.apiKey
      }`
      cy.request({
        method: 'POST',
        url: endpoint,
        form: true,
        body: {
          email,
          password
        }
      })
        .its('body')
        // sure, use async / await functions for 3rd party code
        // parcel bundler transpiles them nicely to promise-returning code
        .then(async body => {
          const db = await openDB('firebaseLocalStorageDb', 1, {
            upgrade (db) {
              db.createObjectStore('firebaseLocalStorage', {
                keyPath: 'fbase_key',
                autoIncrement: false
              })
            }
          })

          const fbase_key = `firebase:authUser:${config.apiKey}:[DEFAULT]`
          const value = {
            appName: '[DEFAULT]',
            // createdAt: String(+new Date()),
            displayName: body.displayName,
            email: body.email,
            emailVerified: false,
            isAnonymous: false,
            // lastLoginAt: String(+new Date()),

            providerData: [
              {
                displayName: body.displayName,
                email: body.email,
                providerId: 'password',
                uid: body.email
              }
            ],
            apiKey: config.apiKey,
            authDomain: config.authDomain,

            stsTokenManager: {
              accessToken: body.idToken,
              apiKey: config.apiKey
              // expirationTime: +new Date() + 1000000
            },
            uid: body.localId
          }
          console.log(value)

          await db.add('firebaseLocalStorage', {
            fbase_key,
            value
          })
        })
    })

    it('works', () => {
      cy.visit('/')
    })
  })
})

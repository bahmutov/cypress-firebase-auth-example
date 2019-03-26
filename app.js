// copied from https://github.com/firebase/quickstart-js

/**
 * Handles the sign in button press.
 */
function toggleSignIn () {
  if (firebase.auth().currentUser) {
    // [START signout]
    firebase.auth().signOut()
    // [END signout]
  } else {
    var email = document.getElementById('email').value
    var password = document.getElementById('password').value
    if (email.length < 4) {
      alert('Please enter an email address.')
      return
    }
    if (password.length < 4) {
      alert('Please enter a password.')
      return
    }
    // Sign in with email and pass.
    // [START authwithemail]
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.')
        } else {
          alert(errorMessage)
        }
        console.log(error)
        document.getElementById('quickstart-sign-in').disabled = false
        // [END_EXCLUDE]
      })
    // [END authwithemail]
  }
  document.getElementById('quickstart-sign-in').disabled = true
}

function initApp () {
  // Listening for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log('User is signed in.', user)
      var displayName = user.displayName
      var email = user.email
      var emailVerified = user.emailVerified
      var photoURL = user.photoURL
      var isAnonymous = user.isAnonymous
      var uid = user.uid
      var providerData = user.providerData

      document.getElementById('quickstart-sign-in-status').textContent =
        'Signed in'
      document.getElementById('quickstart-sign-in').textContent = 'Sign out'
      document.getElementById(
        'quickstart-account-details'
      ).textContent = JSON.stringify(user, null, '  ')
    } else {
      console.log('User is signed out.')
      document.getElementById('quickstart-sign-in-status').textContent =
        'Signed out'
      document.getElementById('quickstart-sign-in').textContent = 'Sign in'
      document.getElementById('quickstart-account-details').textContent = 'null'
    }
    document.getElementById('quickstart-sign-in').disabled = false
  })

  // [END authstatelistener]
  document
    .getElementById('quickstart-sign-in')
    .addEventListener('click', toggleSignIn, false)
}
window.onload = function () {
  initApp()
}

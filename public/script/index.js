// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxjhyOqE2og-V9TNvJ9NMaNxfxPtZUCas",
  authDomain: "bitecoin-banking-app.firebaseapp.com",
  databaseURL: "https://bitecoin-banking-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bitecoin-banking-app",
  storageBucket: "bitecoin-banking-app.appspot.com",
  messagingSenderId: "700081354570",
  appId: "1:700081354570:web:dc24455628bff75782f3b3",
  measurementId: "G-GJWGN4SDZZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
var auth = getAuth();
var db = getDatabase();

if (document.querySelector("title").innerHTML == "Sign-Up") {
  document.getElementById("signup-button").addEventListener("click", register)
}
if (document.querySelector("title").innerHTML == "Log-In") {
  document.getElementById("signin-button").addEventListener("click", login)
}
if (document.querySelector("title").innerHTML == "User") {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      var uid = user.uid
      db = getDatabase()
      console.log(uid)
      get(child(ref(db), "users/" + uid)).then((snapshot)=>{
        document.getElementById("name").innerHTML = "Hey " + snapshot.val().name
        document.getElementById("id").innerHTML = "ID : " + uid
        document.getElementById("bank").innerHTML = snapshot.val().bank + " ß"
        var userrole = snapshot.val().role
        const revenue = document.getElementById("revenue")
        document.getElementById("role").innerHTML = "(role : " + userrole + ")"
        if (userrole == "sans-emploie") {
          revenue.innerHTML = "800 ß/week"
        } else if (userrole == "membre") {
          revenue.innerHTML = "1200 ß/week"
        } else if (userrole == "avocat" || userrole == "gestionnaire de propriété") {
          revenue.innerHTML = "1500 ß/week"
        } else if (userrole == "conseiller") {
          revenue.innerHTML = "2000 ß/week"
        } else if (userrole == "ministre" || userrole == "magistrat" || userrole == "premier ministre") {
          revenue.innerHTML = "2500 ß/week"
        } else if (userrole == "minsitre des finances") {
          revenue.innerHTML = "3000 ß/week"
        } else if (userrole == "administrateur delegay") {
          revenue.innerHTML = "3500 ß/week"
        } else if (userrole == "administrateur supreme") {
          revenue.innerHTML = "4750 ß/week"
        }
        document.getElementById("logout").addEventListener("click", signout)
      })
    } else {
      window.location.href = "./login.html"
    }
  })
}

function register () {
  // Get all our input fields
  var name = document.getElementById("name-input").value
  var email = document.getElementById('email-input').value
  var password = document.getElementById('pswrd-input').value
  var password2 = document.getElementById("pswrd-confirm-input").value

  // Validate input fields
  if (validate_email(email) == false) {
    document.getElementById("email-error").innerHTML = 'Email is Outta Line!!'
    return
    // Don't continue running the code
  } else {
    document.getElementById("email-error").innerHTML = ''
  }
  if (validate_password(password, password2) == false) {
    document.getElementById("pswrd-error").innerHTML = "Password is too short or doesnt match"
    return
  } else {
    document.getElementById("pswrd-error").innerHTML = ''
  }
  if (validate_field(name) == false || validate_field(email) == false || validate_field(password) == false || validate_field(password2) == false) {
    document.getElementById("value-error").innerHTML = 'One or More Extra Fields is Outta Line!!'
    return
  } else {
    document.getElementById("value-error").innerHTML = ''
  }
 
  // Move on with Auth
  createUserWithEmailAndPassword(auth, email, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser
    var uid = user.uid
    var db = getDatabase()

    // Add this user to Firebase Database
    set(ref(db, 'users/' + uid), {
      email : email,
      name : name,
      bank : 0,
      role : "sans-emploie",
      verified : false,
      lend : 0,
      last_login : Date.now()
    });

    // DOne
    setTimeout(() => {window.location.href = "./user.html";}, 5000)
  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var error_message = error.message
    if (error_message == "Firebase: Error (auth/email-already-in-use).") {
      document.getElementById("email-error").innerHTML = "Email is already linked to an account!"
    }
    console.log(error_message)
  })
}

function login () {
  // Get all our input fields
  var email = document.getElementById('email-input').value
  var password = document.getElementById('pswrd-input').value

  // Validate input fields
  if (validate_email(email) == false) {
    document.getElementById("email-error").innerHTML = 'Email or Password is Outta Line!!'
    return
    // Don't continue running the code
  }

  signInWithEmailAndPassword(auth, email, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser
    var uid = user.uid
    var db = getDatabase()
    
    set(ref(db, "users/" + uid + "/last_login"), Date.now())

    // DOne
    console.log('gud')
    setTimeout(() => {window.location.href = "./user.html";}, 5000)


  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })
}

function signout() {
  signOut(auth)
  setTimeout(() => {window.location.href = "./index.html";}, 500)
}

//Validation functions
function validate_email(email) {
  var expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    // Email is good
    return true
  } else {
    // Email is not good
    return false
  }
}

function validate_password(password, password2) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false
  } else if (password != password2) {
    return false
  } else {
    return true
  }
}

function validate_field(field) {
  if (field == null) {
    return false
  }

  if (field.length <= 0) {
    return false
  } else {
    return true
  }
}

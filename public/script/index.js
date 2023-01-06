// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
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
if (document.querySelector("title").innerHTML == "Sign-Up Entreprise") {
  document.getElementById("signup-button").addEventListener("click", registerEntreprise)
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
        if (snapshot.val().entreprise == false) {
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
          if (snapshot.val().admin == true) {
            document.getElementById("logout").insertAdjacentHTML("beforebegin", 
              "<div style='margin-bottom: 5px'><a href='./admin.html'><button><p style='margin: 0;'>Admin Pannel</p></button></a></div><br>"
            )
          }
        } else {
          document.getElementById("name").innerHTML = "Hey " + snapshot.val().name
          document.getElementById("id").innerHTML = "ID : " + uid
          document.getElementById("bank").innerHTML = snapshot.val().bank + " ß"
          document.getElementById("links").innerHTML = ""
          document.getElementById("links").insertAdjacentHTML("afterbegin",
            "<div style='margin-bottom: 5px;'><a href='./transfer.html'><button><p style='margin: 0;'>Transferer</p></button></a></div><br>" +
            "<div style='margin-bottom: 5px;'><a href='./factures.html'><button><p style='margin: 0;'>Factures</p></button></a></div><br>" +
            "<div style='margin-bottom: 5px;'><a href='./userlogs.html'><button><p style='margin: 0;'>Historique</p></button></a></div><br>"
          )
        }
      })
      document.getElementById("logout").addEventListener("click", signout)
      get(child(ref(db), "users/" + uid)).then((snapshot)=>{
        if (snapshot.exists() == true) {
          console.log(snapshot.val().verified)
          if (snapshot.val().verified == false) {
            document.getElementById("name").insertAdjacentHTML("beforebegin", 
            "<h2 style='color: red; margin-bottom: 0px;'>Votre adresse email n'est pas vérifié!</h2><br>" + 
            "<p style='color: red; margin-top: 0px; font-size: 15px;' id='verify-text'>Faites une demande au près d'un administrateur</p>"
            )
            document.getElementById("links").remove()
          }
        } else {
          get(child(ref(db), "entreprises/" + uid)).then((snapshot)=>{
            console.log(snapshot.val().verified)
            if (snapshot.val().verified == false) {
              document.getElementById("name").insertAdjacentHTML("beforebegin", 
              "<h2 style='color: red; margin-bottom: 0px;'>Votre adresse email n'est pas vérifié!</h2><br>" + 
              "<p style='color: red; margin-top: 0px; font-size: 15px;' id='verify-text'>Faites une demande au près d'un administrateur</p>"
              )
              document.getElementById("links").remove()
            }
          })
        }
      })
    } else {
      window.location.href = "./index.html"
    }
  })
}
if (document.querySelector("title").innerHTML == "Transferer") {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      var uid = user.uid
      db = getDatabase()
      console.log(uid)
      get(child(ref(db), "users/" + uid)).then((snapshot)=>{
        document.getElementById("bank").innerHTML = snapshot.val().bank + " ß"
      })
      document.getElementById("transfer-button").addEventListener("click", transfer)
    } else {
      window.location.href = "./index.html"
    }
  })
}
if (document.querySelector("title").innerHTML == "Historique"){
  onAuthStateChanged(auth, (user) => {
    if (user) {
      var uid = user.uid
      db = getDatabase()
      console.log(uid)
      userlogs()
    } else {
      window.location.href = "./index.html"
    }
  })
}
if (document.querySelector("title").innerHTML == "Admin Pannel") {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      var uid = user.uid
      db = getDatabase()
      console.log(uid)
      get(child(ref(db), "users/" + uid)).then((snapshot)=>{
        if (snapshot.val().admin == true) {
          document.getElementById("historique-title").addEventListener("click", toggledisplay)
          adminlogs()
        } else {
          window.location.href = "./user.html"
        }
      })
    } else {
      window.location.href = "./index.html"
    }
  })
}
if (document.querySelector("title").innerHTML == "Demander"){
  onAuthStateChanged(auth, (user) => {
    if (user) {
      var uid = user.uid
      db = getDatabase()
      console.log(uid)
      document.getElementById("lend-button").addEventListener("click", lend)
    } else {
      window.location.href = "./index.html"
    }
  })
}
if (document.querySelector("title").innerHTML == "Factures") {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      var uid = user.uid
      db = getDatabase()
      get(child(ref(db), "users/" + uid)).then((snapshot)=>{
        if (snapshot.val().entreprise == true) {
          document.getElementById("list").insertAdjacentHTML("beforebegin", 
            "<div style='margin-bottom: 5px;'><a href='./factureNew.html'><button><p style='margin: 0;'>Créer nouveau</p></button></a></div><br>"
          )
        }
        document.getElementById("bank").innerHTML = snapshot.val().bank + " ß"
        factureList()
      })
    } else {
      window.location.href = "./index.html"
    }
  })
}
if (document.querySelector("title").innerHTML == "Nouvelle Facture") {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      var uid = user.uid
      db = getDatabase()
      console.log(uid)
      get(child(ref(db), "users")).then((snapshot) =>{
        snapshot.forEach((dataSnapshot)=>{
          if (dataSnapshot.key != uid) {
            if(dataSnapshot.val().entreprise == false) {
              document.getElementById("particuliers").insertAdjacentHTML("beforeend", 
                "<option value='" + dataSnapshot.key + "' id='under-me'>" + dataSnapshot.val().name + " (id : " + dataSnapshot.key + ")" + "</option>"
              )
            } else {
              document.getElementById("entreprises").insertAdjacentHTML("beforeend", 
                "<option value='" + dataSnapshot.key + "' id='under-me'>" + dataSnapshot.val().name + " (id : " + dataSnapshot.key + ")" + "</option>"
              )
            }
          }
        })
      })
      document.getElementById("creer").addEventListener("click", newFacture)
    } else {
      window.location.href = "./index.html"
    }
  })
}

async function register () {
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
  .then(async function() {
    // Declare user variable
    var user = auth.currentUser
    var uid = user.uid
    var db = getDatabase()

    // Add this user to Firebase Database
    await set(ref(db, 'users/' + uid), {
      email : email,
      name : name,
      bank : 0,
      role : "sans-emploie",
      verified : false,
      lend : "",
      entreprise : false,
      admin : false,
      last_login : Date.now()
    });

    // DOne
    window.location.href = "./user.html"
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

async function registerEntreprise () {
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
  .then(async function() {
    // Declare user variable
    var user = auth.currentUser
    var uid = user.uid
    var db = getDatabase()

    // Add this user to Firebase Database
    await set(ref(db, 'users/' + uid), {
      email : email,
      name : name,
      bank : 0,
      verified : false,
      lend : "",
      entreprise : true,
      last_login : Date.now()
    });

    // DOne
    window.location.href = "./user.html"
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
  .then(async function() {
    // Declare user variable
    var user = auth.currentUser
    var uid = user.uid
    var db = getDatabase()
    
    await set(ref(db, "users/" + uid + "/last_login"), Date.now())

    // DOne
    console.log('gud')
    window.location.href = "./user.html"


  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var error_message = error.message

    console.log(error_code)
    if (error_code == "auth/wrong-password") {
      document.getElementById("email-error").innerHTML = "L'émail ou le MDP est incorecte"
    }
  })
}

function signout() {
  signOut(auth)
  setTimeout(() => {window.location.href = "./index.html";}, 500)
}

async function transfer() {
  //Get value of inputs
  var amount = document.getElementById("amount-input").value
  var id = document.getElementById("id-input").value

  //Get database and usefull stuff
  var db = getDatabase()
  var user = auth.currentUser
  var uid = user.uid

  //get value of banks and test them
  var bank = await get(child(ref(db), "users/" + uid)).then((snapshot)=>{
    return snapshot.val().bank
  })
  if (bank < amount) {
    document.getElementById("amount-error").innerHTML = "You do not have enough on your account!"
    return
  }
  var tbank = await get(child(ref(db), "users/" + id))
    .then((snapshot)=>{
      return snapshot.val().bank
    })
    .catch(function(error) {
      document.getElementById("id-error").innerHTML = "This id isn't linked to an account"
      console.log("error code : " + error.message)
      return -1
    })
  if (tbank != -1) {
    document.getElementById("id-error").innerHTML = ""
  } else {
    return
  }

  //Transfer amount
  await set(ref(db, "users/" + uid + "/bank"), bank-amount)
  await set(ref(db, "users/" + id + "/bank"), Number(tbank)+Number(amount))

  //Log transfer to database
  await set(ref(db, "transactions/" + Date.now()), {
    name : uid,
    target : id,
    amount : amount
  })

  //Done
  document.getElementById("result").innerHTML = "Transfère réussit!"
}

async function userlogs() {
  var db = getDatabase()
  var user = auth.currentUser
  var uid = user.uid

  get(child(ref(db),"transactions"))
    .then((snapshot)=>{
      snapshot.forEach(async (dataSnapshot)=>{
        var date = new Date(Number(dataSnapshot.key))
        var month = Number(date.getMonth()) + Number(1)
        var target = await get(child(ref(db), "users/" + dataSnapshot.val().target)).then((snapshotDataSnapshot)=>{ return snapshotDataSnapshot.val().name})
        var name = await get(child(ref(db), "users/" + dataSnapshot.val().name)).then((snapshotDataSnapshot)=>{ return snapshotDataSnapshot.val().name})
        if (dataSnapshot.val().name == "bank" && dataSnapshot.val().target == uid) {
          document.getElementById("under-me").insertAdjacentHTML("afterend", 
            "<div class='transaction-data'><h2 style='margin-bottom: 0;'>Lended " + dataSnapshot.val().amount + " ß to the " + name + "</h2><p style='margin-top: 0;'> on the " + date.getDate() + "-" + month + "-" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "</p></div>"
          )
        } else if (dataSnapshot.val().target == "bank" && dataSnapshot.val().name == uid) {
          document.getElementById("under-me").insertAdjacentHTML("afterend", 
            "<div class='transaction-data'><h2 style='margin-bottom: 0;'>Refunded " + dataSnapshot.val().amount + " ß to the " + target + "</h2><p style='margin-top: 0;'> on the " + date.getDate() + "-" + month + "-" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "</p></div>"
          )
        } else if (dataSnapshot.val().name == uid) {
          document.getElementById("under-me").insertAdjacentHTML("afterend", 
            "<div class='transaction-data'><h2 style='margin-bottom: 0;'>Transfered " + dataSnapshot.val().amount + " ß to " + target + "</h2><p style='margin-top: 0;'> on the " + date.getDate() + "-" + month + "-" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "</p></div>"
          )
        } else if (dataSnapshot.val().target == uid) {
          document.getElementById("under-me").insertAdjacentHTML("afterend", 
            "<div class='transaction-data'><h2 style='margin-bottom: 0;'>Recieved " + dataSnapshot.val().amount + " ß from " + name + "</h2><p style='margin-top: 0;'> on the " + date.getDate() + "-" + month + "-" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "</p></div>"
          )
        }
      })
    })
}

async function adminlogs() {
  var db = getDatabase()
  get(child(ref(db), "transactions"))
    .then((snapshot)=>{
      snapshot.forEach(async (dataSnapshot)=>{
        var date = new Date(Number(dataSnapshot.key))
        var month = Number(date.getMonth()) + Number(1)
        var target = await get(child(ref(db), "users/" + dataSnapshot.val().target)).then((snapshotDataSnapshot)=>{ return snapshotDataSnapshot.val().name})
        var name = await get(child(ref(db), "users/" + dataSnapshot.val().name)).then((snapshotDataSnapshot)=>{ return snapshotDataSnapshot.val().name})
        if (dataSnapshot.val().name == "bank") {
          document.getElementById("under-me").insertAdjacentHTML("afterend", 
            "<div class='transaction-data'><h2 style='margin-bottom: 0;'>" + target + " lended " + dataSnapshot.val().amount + " ß to the " + name + "</h2><p style='margin-top: 0;'> on the " + date.getDate() + "-" + month + "-" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "</p></div>"
          )
        } else if (dataSnapshot.val().target == "bank") {
          document.getElementById("under-me").insertAdjacentHTML("afterend", 
            "<div class='transaction-data'><h2 style='margin-bottom: 0;'>" + name + " refunded " + dataSnapshot.val().amount + " ß to the " + target + "</h2><p style='margin-top: 0;'> on the " + date.getDate() + "-" + month + "-" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "</p></div>"
          )
        } else {
          document.getElementById("under-me").insertAdjacentHTML("afterend", 
            "<div class='transaction-data'><h2 style='margin-bottom: 0;'>" + name + " transfered " + dataSnapshot.val().amount + " ß to " + target + "</h2><p style='margin-top: 0;'> on the " + date.getDate() + "-" + month + "-" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "</p></div>"
          )
        }
      })
    })
}

function toggledisplay() {
  (function(style) {
    style.display = style.display === 'none' ? '' : 'none';
  })(document.getElementById("historique").style);
}

async function lend() {
  var db = getDatabase()
  var user = auth.currentUser
  var uid = user.uid

  var bank = await get(child(ref(db), "users/" + uid)).then((snapshot)=>{
    return snapshot.val().bank
  })
  var amount = Number(document.getElementById("amount-input").value)
  var weeks = Number(document.getElementById("time-input").value)

  var i = weeks/2
  var payments = Math.round(amount * (1 + (i/100))/weeks)
  console.log(amount, weeks, i, payments)
  if ((weeks - Math.floor(weeks)) != 0 || weeks == 0) {
    document.getElementById("time-error").innerHTML = "Please enter a valid number of weeks"
    return
  } else {
    document.getElementById("time-error").innerHTML = ""
  }
  set(ref(db, "users/" + uid + "/lend/" + Date.now()), {
    amount : amount,
    payments : payments,
    weeks_left : weeks,
    intrest : i
  })
  set(ref(db, "users/" + uid + "/bank"), Number(bank) + amount)
  set(ref(db, "transactions/" + Date.now()), {
    name : "bank",
    target : uid,
    amount : amount
  })
  document.getElementById("result").innerHTML = "lended succesfully"
}

async function newFacture() {
  var db = getDatabase()
  var user = auth.currentUser
  var uid = user.uid

  //input values
  var target = document.getElementById("ids").value
  var amount = Number(document.getElementById("amount-input").value)
  var confirm = document.getElementById("confirm").checked
  //test input values
  if (target == "none") {
    document.getElementById("id-error").innerHTML = "Veuillez entrer un utilisateur existant"
  }
  document.getElementById("id-error").innerHTML = ""
  if (/^\d+$/.test(amount) == false) {
    document.getElementById("amount-error").innerHTML = "Veuillez entrer un nombre (sans symbols)"
  }
  document.getElementById("amount-error").innerHTML = ""
  if (confirm == false) {
    document.getElementById("checkbox-error").innerHTML = "Veuillez confirmer votre choix"
  }
  document.getElementById("checkbox-error").innerHTML = ""
  //create the facture
  await set(ref(db, "factures/" + Date.now()), {
    name : uid,
    target : target,
    amount : amount
  })
  //done
  window.location.href = "./factures.html"
}

async function factureList() {
  var db = getDatabase()
  var user = auth.currentUser
  var uid = user.uid

  get(child(ref(db), "factures")).then((snapshot)=>{
    snapshot.forEach(async (dataSnapshot)=>{
      var date = new Date(Number(dataSnapshot.key))
      console.log(date.getTime())
      var today = new Date()
      var daysSince = Math.floor((today.getTime() - date.getTime()) / (1000 * 3600 * 24))
      if (dataSnapshot.val().name == uid) {
        var name = await get(child(ref(db), "users/" + dataSnapshot.val().target)).then((snapshotDataSnapshot)=>{ return snapshotDataSnapshot.val().name})
        if (dataSnapshot.val().rappel3 != null) {
          var lastRemind = new Date(Number(dataSnapshot.val().rappel3))
          var daysSinceLastRemind = Math.floor((today.getTime() - lastRemind.getTime()) / (1000 * 3600 * 24))
          document.getElementById("list").insertAdjacentHTML("beforeend", 
          `<div class="transaction-data">
              <h3 style="margin-bottom: 0px;">Sortant</h3>
              <div style="display: flex; justify-content: center; margin: 0px 20px;">
                <p style="margin-top: 0; margin-right: 20px; margin-bottom: 0px;">Target : ` + name + `</p>
                <p style="margin-top: 0; margin-bottom: 0px;">Montant : ` + dataSnapshot.val().amount + `ß</p>
              </div>
              <div style="display: flex; justify-content: center; margin: 0px 20px; align-items: center;">
                <p style="font-size: 16px; margin-top: 0; margin-bottom: 0px;">Rappels :</p>
                <img src="./style/checked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;">
                <img src="./style/checked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;">
                <img src="./style/checked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;">  
              </div>
              <div style="display: flex; justify-content: center; margin: 0px 20px; align-items: center;">
                <div>
                  <p style="font-size: 16px;" style="margin-top: 0; margin-bottom: 0;">Dernier Rappel : ` + daysSinceLastRemind + `j</p>
                  <p style="font-size: 16px;" style="margin-top: 0;">Creation :` + daysSince + `j</p>
                </div>
              </div>
            </div>`
          )
        } else if (dataSnapshot.val().rappel2 != null) {
          var lastRemind = new Date(Number(dataSnapshot.val().rappel2))
          var daysSinceLastRemind = Math.floor((today.getTime() - lastRemind.getTime()) / (1000 * 3600 * 24))
          document.getElementById("list").insertAdjacentHTML("beforeend", 
          `<div class="transaction-data">
              <h3 style="margin-bottom: 0px;">Sortant</h3>
              <div style="display: flex; justify-content: center; margin: 0px 20px;">
                <p style="margin-top: 0; margin-right: 20px; margin-bottom: 0px;">Target : ` + name + `</p>
                <p style="margin-top: 0; margin-bottom: 0px;">Montant : ` + dataSnapshot.val().amount + `ß</p>
              </div>
              <div style="display: flex; justify-content: center; margin: 0px 20px; align-items: center;">
                <p style="font-size: 16px; margin-top: 0; margin-bottom: 0px;">Rappels :</p>
                <img src="./style/checked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;">
                <img src="./style/checked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;">
                <img src="./style/unchecked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;">  
              </div>
              <div style="display: flex; justify-content: center; margin: 0px 20px; align-items: center;">
                <div>
                  <p style="font-size: 16px;" style="margin-top: 0; margin-bottom: 0;">Dernier Rappel : ` + daysSinceLastRemind + `j</p>
                  <p style="font-size: 16px;" style="margin-top: 0;">Creation :` + daysSince + `j</p>
                </div>
                <button style="width: 5pc; display: flex; align-items: center; justify-content: center; margin-left: 20px;" id="remind-` + dataSnapshot.key + `"><p>Rapeler</p></button>
              </div>
            </div>`
          )
          document.getElementById("remind-"+dataSnapshot.key).addEventListener("click", () => {
            remind(dataSnapshot.key)
          })
        } else if (dataSnapshot.val().rappel1 != null) {
          var lastRemind = new Date(Number(dataSnapshot.val().rappel1))
          var daysSinceLastRemind = Math.floor((today.getTime() - lastRemind.getTime()) / (1000 * 3600 * 24))
          document.getElementById("list").insertAdjacentHTML("beforeend", 
          `<div class="transaction-data">
              <h3 style="margin-bottom: 0px;">Sortant</h3>
              <div style="display: flex; justify-content: center; margin: 0px 20px;">
                <p style="margin-top: 0; margin-right: 20px; margin-bottom: 0px;">Target : ` + name + `</p>
                <p style="margin-top: 0; margin-bottom: 0px;">Montant : ` + dataSnapshot.val().amount + `ß</p>
              </div>
              <div style="display: flex; justify-content: center; margin: 0px 20px; align-items: center;">
                <p style="font-size: 16px; margin-top: 0; margin-bottom: 0px;">Rappels :</p>
                <img src="./style/checked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;">
                <img src="./style/unchecked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;">
                <img src="./style/unchecked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;">  
              </div>
              <div style="display: flex; justify-content: center; margin: 0px 20px; align-items: center;">
                <div>
                  <p style="font-size: 16px;" style="margin-top: 0; margin-bottom: 0;">Dernier Rappel : ` + daysSinceLastRemind + `j</p>
                  <p style="font-size: 16px;" style="margin-top: 0;">Creation :` + daysSince + `j</p>
                </div>
                <button style="width: 5pc; display: flex; align-items: center; justify-content: center; margin-left: 20px;" id="remind-` + dataSnapshot.key + `"><p>Rapeler</p></button>
              </div>
            </div>`
          )
          document.getElementById("remind-"+dataSnapshot.key).addEventListener("click", () => {
            remind(dataSnapshot.key)
          })
        } else {
          document.getElementById("list").insertAdjacentHTML("beforeend", 
          `<div class="transaction-data">
              <h3 style="margin-bottom: 0px;">Sortant</h3>
              <div style="display: flex; justify-content: center; margin: 0px 20px;">
                <p style="margin-top: 0; margin-right: 20px; margin-bottom: 0px;">Target : ` + name + `</p>
                <p style="margin-top: 0; margin-bottom: 0px;">Montant : ` + dataSnapshot.val().amount + `ß</p>
              </div>
              <div style="display: flex; justify-content: center; margin: 0px 20px; align-items: center;">
                <p style="font-size: 16px; margin-top: 0; margin-bottom: 0px;">Rappels :</p>
                <img src="./style/unchecked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;">
                <img src="./style/unchecked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;">
                <img src="./style/unchecked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;">  
              </div>
              <div style="display: flex; justify-content: center; margin: 0px 20px; align-items: center;">
                <div>
                  <p style="font-size: 16px;" style="margin-top: 0;">Creation :` + daysSince + `j</p>
                </div>
                <button style="width: 5pc; display: flex; align-items: center; justify-content: center; margin-left: 20px;" id="remind-` + dataSnapshot.key + `"><p>Rapeler</p></button>
              </div>
            </div>`
          )
          document.getElementById("remind-"+dataSnapshot.key).addEventListener("click", () => {
            remind(dataSnapshot.key)
          })
        }
      }
      if (dataSnapshot.val().target == uid) {
        var name = await get(child(ref(db), "users/" + dataSnapshot.val().name)).then((snapshotDataSnapshot)=>{ return snapshotDataSnapshot.val().name})
        if (dataSnapshot.val().rappel3 != null) {
          var lastRemind = new Date(Number(dataSnapshot.val().rappel3))
          var daysSinceLastRemind = Math.floor((today.getTime() - lastRemind.getTime()) / (1000 * 3600 * 24))
          document.getElementById("list").insertAdjacentHTML("afterbegin",
            `<div class="transaction-data">
              <h3 style="margin-bottom: 0px;">Reçue</h3>
              <div style="display: flex; justify-content: center; margin: 0px 20px;">
                <p style="margin-top: 0; margin-right: 20px; margin-bottom: 0px;">Auteur : ` + name + `</p>
                <p style="margin-top: 0; margin-bottom: 0px;">Montant : ` + dataSnapshot.val().amount + `ß</p>
              </div>
              <div style="display: flex; justify-content: center; margin: 0px 20px; align-items: center;">
                <p style="font-size: 16px; margin-top: 0; margin-bottom: 0px;">Rappels :</p>
                <img src="./style/checked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;">
                <img src="./style/checked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;">
                <img src="./style/checked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;">  
              </div>
              <div style="display: flex; justify-content: center; margin: 0px 20px; align-items: center;">
                <div>
                    <p style="font-size: 16px;" style="margin-top: 0; margin-bottom: 0;">Dernier Rappel : ` + daysSinceLastRemind + `j</p>
                    <p style="font-size: 16px;" style="margin-top: 0;">Creation :` + lastRemind + `j</p>
                </div>
              </div>
            </div>`
          )
        } else if (dataSnapshot.val().rappel2 != null) {
          var lastRemind = new Date(Number(dataSnapshot.val().rappel2))
          var daysSinceLastRemind = Math.floor((today.getTime() - lastRemind.getTime()) / (1000 * 3600 * 24))
          document.getElementById("list").insertAdjacentHTML("afterbegin",
            `<div class="transaction-data">
              <h3 style="margin-bottom: 0px;">Reçue</h3>
              <div style="display: flex; justify-content: center; margin: 0px 20px;">
                <p style="margin-top: 0; margin-right: 20px; margin-bottom: 0px;">Auteur : ` + name + `</p>
                <p style="margin-top: 0; margin-bottom: 0px;">Montant : ` + dataSnapshot.val().amount + `ß</p>
              </div>
              <div style="display: flex; justify-content: center; margin: 0px 20px; align-items: center;">
                <p style="font-size: 16px; margin-top: 0; margin-bottom: 0px;">Rappels :</p>
                <img src="./style/checked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;">
                <img src="./style/checked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;">
                <img src="./style/unchecked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;">  
              </div>
              <div style="display: flex; justify-content: center; margin: 0px 20px; align-items: center;">
                <div>
                    <p style="font-size: 16px;" style="margin-top: 0; margin-bottom: 0;">Dernier Rappel : ` + daysSinceLastRemind + `j</p>
                    <p style="font-size: 16px;" style="margin-top: 0;">Creation :` + lastRemind + `j</p>
                </div>
                <button style="width: 5pc; display: flex; align-items: center; justify-content: center; margin-left: 20px;" id="pay-` + dataSnapshot.key + `"><p>Payer</p></button>
              </div>
            </div>`
          )
        } else if (dataSnapshot.val().rappel1 != null) {
          var lastRemind = new Date(Number(dataSnapshot.val().rappel1))
          var daysSinceLastRemind = Math.floor((today.getTime() - lastRemind.getTime()) / (1000 * 3600 * 24))
          document.getElementById("list").insertAdjacentHTML("afterbegin",
            `<div class="transaction-data">
              <h3 style="margin-bottom: 0px;">Reçue</h3>
              <div style="display: flex; justify-content: center; margin: 0px 20px;">
                <p style="margin-top: 0; margin-right: 20px; margin-bottom: 0px;">Auteur : ` + name + `</p>
                <p style="margin-top: 0; margin-bottom: 0px;">Montant : ` + dataSnapshot.val().amount + `ß</p>
              </div>
              <div style="display: flex; justify-content: center; margin: 0px 20px; align-items: center;">
                <p style="font-size: 16px; margin-top: 0; margin-bottom: 0px;">Rappels :</p>
                <img src="./style/checked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;">
                <img src="./style/unchecked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;">
                <img src="./style/unchecked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;">  
              </div>
              <div style="display: flex; justify-content: center; margin: 0px 20px; align-items: center;">
                <div>
                    <p style="font-size: 16px;" style="margin-top: 0; margin-bottom: 0;">Dernier Rappel : ` + daysSinceLastRemind + `j</p>
                    <p style="font-size: 16px;" style="margin-top: 0;">Creation :` + lastRemind + `j</p>
                </div>
                <button style="width: 5pc; display: flex; align-items: center; justify-content: center; margin-left: 20px;" id="pay-` + dataSnapshot.key + `"><p>Payer</p></button>
              </div>
            </div>`
          )
        } else {
          document.getElementById("list").insertAdjacentHTML("afterbegin",
            `<div class="transaction-data">
              <h3 style="margin-bottom: 0px;">Reçue</h3>
              <div style="display: flex; justify-content: center; margin: 0px 20px;">
                <p style="margin-top: 0; margin-right: 20px; margin-bottom: 0px;">Auteur : ` + name + `</p>
                <p style="margin-top: 0; margin-bottom: 0px;">Montant : ` + dataSnapshot.val().amount + `ß</p>
              </div>
              <div style="display: flex; justify-content: center; margin: 0px 20px; align-items: center;">
                <p style="font-size: 16px; margin-top: 0; margin-bottom: 0px;">Rappels :</p>
                <img src="./style/unchecked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;">
                <img src="./style/unchecked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;">
                <img src="./style/unchecked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;">  
              </div>
              <div style="display: flex; justify-content: center; margin: 0px 20px; align-items: center;">
                <div>
                    <p style="font-size: 16px;" style="margin-top: 0; margin-bottom: 0;">Dernier Rappel : ` + daysSinceLastRemind + `j</p>
                    <p style="font-size: 16px;" style="margin-top: 0;">Creation :` + lastRemind + `j</p>
                </div>
                <button style="width: 5pc; display: flex; align-items: center; justify-content: center; margin-left: 20px;" id="pay-` + dataSnapshot.key + `"><p>Payer</p></button>
              </div>
            </div>`
          )
        }
        document.getElementById("pay-"+dataSnapshot.key).addEventListener("click", () => {
          pay(dataSnapshot.key)
        })
      }
    })
  })
}

async function remind(facture) {
  var db = getDatabase()
  var user = auth.currentUser
  var uid = user.uid
  var today = new Date()

  get(child(ref(db), "factures/" + facture)).then(async (snapshot)=>{
    if (snapshot.val().rappel2 != null) {
      var date = new Date(snapshot.key)
      if (Math.floor((today.getTime() - date.getTime()) / (1000 * 3600 * 24)) >= 5) {
        await set(ref(db, "factures/" + facture + "/rappel3"), Date.now())
      } else {
        alert("Il faut attendre 5j pour faire le premier rappel")
        return
      }
    } else if (snapshot.val().rappel1 != null) {
      var date = new Date(snapshot.key)
      if (Math.floor((today.getTime() - date.getTime()) / (1000 * 3600 * 24)) >= 5) {
        await set(ref(db, "factures/" + facture + "/rappel2"), Date.now())
      } else {
        alert("Il faut attendre 5j entre les rappels")
        return
      }
    } else {
      var date = new Date(snapshot.key)
      if (Math.floor((today.getTime() - date.getTime()) / (1000 * 3600 * 24)) >= 5) {
        await set(ref(db, "factures/" + facture + "/rappel1"), Date.now())
      } else {
        alert("Il faut attendre 5j entre les rappels")
        return
      }
    }
  })
}

async function pay(facture) {
  var db = getDatabase()
  var user = auth.currentUser
  var uid = user.uid

  //check if user has enough money
  var fAmount = await get(child(ref(db), "factures/" + facture)).then((snapshot) => { return snapshot.val().amount })
  var bank = await get(child(ref(db), "users/" + uid)).then((snapshot)=>{ return snapshot.val().bank })
  if (Number(fAmount) > Number(bank)) {
    alert("You do not have enough money")
    return
  }
  var benefUid = await get(child(ref(db), "factures/" + facture)).then((snapshot) => { return snapshot.val().name })
  var benefBank = await get(child(ref(db), "users/" + benefUid)).then((snapshot) => { return snapshot.val().bank })

  //update users bank
  await set(ref(db, "users/" + uid + "/bank"), Number(bank) - Number(fAmount))

  //update benef bank
  await set(ref(db, "users/" + benefUid + "/bank"), Number(benefBank) + Number(fAmount))

  //log transaction
  await set(ref(db, "transactions/" + Date.now()), {
    name : uid,
    target : benefUid,
    amount : fAmount
  })

  //remove facture
  await set(ref(db, "factures/" + facture), null)
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
  if (password.length < 6) {
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


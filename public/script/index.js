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
indexPage();
document.getElementById("header-text").addEventListener("click", indexPage)

function indexPage() {
  if (document.querySelector("section") != null) {
    document.querySelector("section").remove()
  }
  document.querySelector("header").insertAdjacentHTML("afterend", 
    "<section id='info'>"
        + "<p>The ONLY banking app approved by the FDO</p>"
        + "<p>User friendly and easy to use</p>"
        + "<p>Join <span style='font-weight: bolder;'>today</span> for free</p>"
        + "<a id='register-button'><button><p style='margin: 0;'>Register</p></button></a><br>"
        + "<a id='login-button'>Already have an account? Sign-In</a>"
    + "</section>"
  )
  document.getElementById("register-button").addEventListener("click", signupPage
  )
  document.getElementById("login-button").addEventListener("click", loginPage
  )
}


function signupPage () {
  document.querySelector("section").remove()
  document.querySelector("header").insertAdjacentHTML("afterend", 
    '<section id="login">'
      +'<h1>Register</h1>'
      +'<input type="text" placeholder="Name" id="name-input"><br>'
      +'<input type="email" placeholder="E-mail" id="email-input" style="margin-top: 20px;"><br>'
      +'<p style="font-size: 12px; color: red;margin-top: 0;" id="email-error"></p>'
      +'<input type="password" placeholder="Password" id="pswrd-input" style="margin-top: 10px;"><br>'
      +'<p style="font-size: 12px; color: red;margin-top: 0;" id="pswrd-error"></p>'
      +'<input type="password" placeholder="Confirm Password" style="margin-top: 10px;" id="pswrd-confirm-input"><br>'
      +'<p style="font-size: 12px; color: red;margin-top: 0;" id="value-error"></p>'
      +'<button style="margin-top: 20px;" id="signup-button">Sign-Up</button><br>'
      +'<a id="login-button">Already have an account : Sign-In</a>'
    +'</section>'
  )
  document.getElementById("signup-button").addEventListener("click", register)
  document.getElementById("login-button").addEventListener("click", loginPage
  )
}
function loginPage() {
  document.querySelector("section").remove()
  document.querySelector("header").insertAdjacentHTML("afterend", 
    '<section id="login">'
    +'<h1>Sign-In</h1>'
    +'<p style="font-size: 12px; color: red;margin-top: 0;" id="email-error"></p>'
    +'<input type="email" placeholder="E-mail" id="email-input"><br>'
    +'<input type="password" placeholder="Password" style="margin-top: 20px;" id="pswrd-input"><br>'
    +'<button style="margin-top: 20px;" id="signin-button">Sign-In</button><br>'
    +"<a id='register-button'>Don't have an account : Register</a>"
    +'</section>'
  )
  document.getElementById("signin-button").addEventListener("click", login)
  document.getElementById("register-button").addEventListener("click", signupPage)
}
function userPage() {
  document.querySelector("section").remove()
  document.querySelector("header").insertAdjacentHTML("afterend", 
    '<section id="login">'
      +'<h1 id="name" style="margin-bottom: 0;"></h1>'
      +'<p id="id" style="margin-top: 0; font-size: 14px; margin-bottom: 0;"></p>'
      +'<p id="role" style="margin-top: 0; font-size: 15px;"></p>'
      +'<h1 id="bank" style="margin-bottom: 0;"></h1>'
      +'<p id="revenue" style="margin-top: 0;"></p>'
      +'<div style="margin-bottom: 5px;"><a id="transfer-button"><button><p style="margin: 0;">Transferer</p></button></a></div><br>'
      +'<div style="margin-bottom: 5px"><a id="lend-button"><button><p style="margin: 0;">Demander</p></button></a></div><br>'
      +'<div style="margin-bottom: 5px"><a id="userlogs-button"><button><p style="margin: 0;">Historique</p></button></a></div><br>'
      +'<a id="logout">Log-Out</a>'
    +'</section>'
  )
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
        } else if (userrole == "ministre des finances") {
          revenue.innerHTML = "3000 ß/week"
        } else if (userrole == "administrateur delegay") {
          revenue.innerHTML = "3500 ß/week"
        } else if (userrole == "administrateur supreme") {
          revenue.innerHTML = "4750 ß/week"
        }
        if (snapshot.val().admin == true) {
          document.getElementById("logout").insertAdjacentHTML("beforebegin", 
            "<div style='margin-bottom: 5px'><a id='admin-button'><button><p style='margin: 0;'>Admin Pannel</p></button></a></div><br>"
          )
          document.getElementById("admin-button").addEventListener("click", adminPage)
        }
      })
      document.getElementById("logout").addEventListener("click", signout)
      document.getElementById("transfer-button").addEventListener("click", transferPage)
      document.getElementById("userlogs-button").addEventListener("click", userlogsPage)
      document.getElementById("lend-button").addEventListener("click", lendPage)
      document.getElementById("admin-button").addEventListener("click", update)
    } else {
      indexPage()
    }
  })
}
function transferPage() {
  document.querySelector("section").remove()
  document.querySelector("header").insertAdjacentHTML("afterend", 
    '<section id="info">'
      +'<h1>Transférer</h1>'
      +'<p id="bank" style="margin-bottom: 0;"></p>'
      +'<input placeholder="amount" style="margin-top: 20px;" id="amount-input"><br>'
      +'<p style="margin: 0; font-size: 14px; color:red;" id="amount-error"></p>'
      +'<select id="id-select" style="margin-top: 15px; width: 16.5pc;">'
        +'<option value="none" id="under-me">-- Please choose an option --</option>'
      +'</select>'
      +'<p style="margin: 0; font-size: 14px; color:red;" id="id-error"></p>'
      +'<button style="margin-top: 20px;" id="transfer-button"><p style="margin: 0px;">Envoyer</p></button><br>'
      +'<p style="color: green;" id="result"></p>'
      +'<a id="back-button">Retour</a>'
    +'</section>'
  )
  onAuthStateChanged(auth, (user) => {
    if (user) {
      var uid = user.uid
      db = getDatabase()
      console.log(uid)
      get(child(ref(db), "users/" + uid)).then((snapshot)=>{
        document.getElementById("bank").innerHTML = snapshot.val().bank + " ß"
      })
      get(child(ref(db), "users/"))
        .then((snapshot)=>{
          snapshot.forEach((dataSnapshot)=>{
            if (dataSnapshot.key != uid) {
              document.getElementById("under-me").insertAdjacentHTML("afterend", 
                "<option value='" + dataSnapshot.key + "' id='under-me'>" + dataSnapshot.val().name + " (id : " + dataSnapshot.key + ")" + "</option>"
              )
            }
          })
        })
      document.getElementById("transfer-button").addEventListener("click", transfer)
      document.getElementById("back-button").addEventListener("click", userPage)
    } else {
      indexPage()
    }
  })
}
function userlogsPage() {
  document.querySelector("section").remove()
  document.querySelector("header").insertAdjacentHTML("afterend", 
    '<section id="login">'
      +'<a id="back-button">Retour</a>'
      +'<h1>Historique de transactions</h1>'
      +'<p id="under-me"></p>'
    +'</section>'
  )
  onAuthStateChanged(auth, (user) => {
    if (user) {
      var uid = user.uid
      db = getDatabase()
      console.log(uid)
      userlogs()
    } else {
      indexPage()
    }
  })
  document.getElementById("back-button").addEventListener("click", userPage)
}
function adminPage() {
  document.querySelector("section").remove()
  document.querySelector("header").insertAdjacentHTML("afterend", 
    '<section id="login">'
      +'<a id="back-button">Retour</a>'
      +'<h1>Admin Pannel</h1>'
      +'<h2 id="historique-title">Historique de transactions</h2>'
      +'<div id="historique" style="display: none;">'
          +'<p id="under-me"></p>'
      +'</div>'
      +'<button id="weekly-update"><h2 style="margin: 0;">Weekly Update</h2></button>'
    +'</section>'
  )
  onAuthStateChanged(auth, (user) => {
    if (user) {
      var uid = user.uid
      db = getDatabase()
      console.log(uid)
      get(child(ref(db), "users/" + uid)).then((snapshot)=>{
        if (snapshot.val().admin == true) {
          document.getElementById("historique-title").addEventListener("click", toggledisplay)
          adminlogs()
          document.getElementById("weekly-update").addEventListener("click", update)
          document.getElementById("back-button").addEventListener("click", userPage)
        } else {
          userPage()
        }
      })
    } else {
      indexPage()
    }
  })
}
function lendPage() {
  document.querySelector("section").remove()
  document.querySelector("header").insertAdjacentHTML("afterend", 
    '<section id="info">'
      +'<h1>Demander</h1>'
      +'<p id="bank" style="margin-bottom: 0;"></p>'
      +'<input placeholder="amount" style="margin-top: 20px;" id="amount-input"><br>'
      +'<p style="margin: 0; font-size: 14px; color:red;" id="amount-error"></p>'
      +'<input placeholder="time" style="margin-top: 20px;" id="time-input"><br>'
      +'<p style="margin: 0; font-size: 14px; color:red;" id="time-error"></p>'
      +'<p style="margin: 0; font-size: 14px;">Le temps mis fait varier le nombre de fois le remboursement est divisé<br>et determine la valeur de l' + "'" + 'interet dans la logique que 1 semaine = +0,5%.</p>'
      +'<p style="font-size: 14px;">Donc si vous metez amount = 100000 et time = 20,<br>vous devrez rembourser 110000 ß divisé en payements de 5500 ß</p>'
      +'<p style="font-size: 14px;">Si vous ne savez pas repayer la banque, votre solde sera negatif</p>'
      +'<button style="margin-top: 20px;" id="lend-button"><p style="margin: 0px;">Envoyer</p></button><br>'
      +'<p style="color: green;" id="result"></p>'
      +'<a id="back-button">Retour</a>'
    +'</section>'
  )
  onAuthStateChanged(auth, (user) => {
    if (user) {
      var uid = user.uid
      db = getDatabase()
      console.log(uid)
      document.getElementById("lend-button").addEventListener("click", lend)
      document.getElementById("back-button").addEventListener("click", userPage)
    } else {
      indexPage()
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
      admin : false,
      last_login : Date.now()
    });

    // DOne
    userPage()
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
    userPage()


  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })
}

async function signout() {
  await signOut(auth)
  indexPage
}

async function transfer() {
  //Get value of inputs
  var amount = document.getElementById("amount-input").value
  var id = document.getElementById("id-select").value

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
  var name = await get(child(ref(db), "users/" + uid)).then((snapshot)=>{
    return snapshot.val().name
  })
  var tname = await get(child(ref(db), "users/" + id)).then((snapshot)=>{
    return snapshot.val().name
  })
  await set(ref(db, "transactions/" + Date.now()), {
    name : name,
    target : tname,
    amount : amount
  })

  //Done
  document.getElementById("result").innerHTML = "Transfère réussit!"
}

async function userlogs() {
  var db = getDatabase()
  var user = auth.currentUser
  var uid = user.uid

  var name = await get(child(ref(db), "users/" + uid)).then((snapshot)=>{
    return snapshot.val().name
  })

  get(child(ref(db),"transactions"))
    .then((snapshot)=>{
      snapshot.forEach((dataSnapshot)=>{
        console.log(dataSnapshot.val())
        var date = new Date(Number(dataSnapshot.key))
        var month = Number(date.getMonth()) + Number(1)
        if (dataSnapshot.val().name == "bank") {
          document.getElementById("under-me").insertAdjacentHTML("afterend", 
            "<div class='transaction-data'><h2 style='margin-bottom: 0;'>Lended " + dataSnapshot.val().amount + " ß to the " + dataSnapshot.val().name + "</h2><p style='margin-top: 0;'> on the " + date.getDate() + "-" + month + "-" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "</p></div>"
          )
        } else if (dataSnapshot.val().target == "bank") {
          document.getElementById("under-me").insertAdjacentHTML("afterend", 
            "<div class='transaction-data'><h2 style='margin-bottom: 0;'>Refunded " + dataSnapshot.val().amount + " ß to the " + dataSnapshot.val().target + "</h2><p style='margin-top: 0;'> on the " + date.getDate() + "-" + month + "-" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "</p></div>"
          )
        } else if (dataSnapshot.val().name == name) {
          document.getElementById("under-me").insertAdjacentHTML("afterend", 
            "<div class='transaction-data'><h2 style='margin-bottom: 0;'>Transfered " + dataSnapshot.val().amount + " ß to " + dataSnapshot.val().target + "</h2><p style='margin-top: 0;'> on the " + date.getDate() + "-" + month + "-" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "</p></div>"
          )
        } else if (dataSnapshot.val().target == name) {
          document.getElementById("under-me").insertAdjacentHTML("afterend", 
            "<div class='transaction-data'><h2 style='margin-bottom: 0;'>Recieved " + dataSnapshot.val().amount + " ß from " + dataSnapshot.val().name + "</h2><p style='margin-top: 0;'> on the " + date.getDate() + "-" + month + "-" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "</p></div>"
          )
        }
      })
    })
}

async function adminlogs() {
  var db = getDatabase()
  get(child(ref(db), "transactions"))
    .then((snapshot)=>{
      snapshot.forEach((dataSnapshot)=>{
        var date = new Date(Number(dataSnapshot.key))
        var month = Number(date.getMonth()) + Number(1)
        if (dataSnapshot.val().name == "bank") {
          document.getElementById("under-me").insertAdjacentHTML("afterend", 
            "<div class='transaction-data'><h2 style='margin-bottom: 0;'>" + dataSnapshot.val().target + " lended " + dataSnapshot.val().amount + " ß to the " + dataSnapshot.val().name + "</h2><p style='margin-top: 0;'> on the " + date.getDate() + "-" + month + "-" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "</p></div>"
          )
        } else if (dataSnapshot.val().target == "bank") {
          document.getElementById("under-me").insertAdjacentHTML("afterend", 
            "<div class='transaction-data'><h2 style='margin-bottom: 0;'>" + dataSnapshot.val().name + " refunded " + dataSnapshot.val().amount + " ß to the " + dataSnapshot.val().target + "</h2><p style='margin-top: 0;'> on the " + date.getDate() + "-" + month + "-" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "</p></div>"
          )
        } else {
          document.getElementById("under-me").insertAdjacentHTML("afterend", 
            "<div class='transaction-data'><h2 style='margin-bottom: 0;'>" + dataSnapshot.val().name + " transfered " + dataSnapshot.val().amount + " ß to " + dataSnapshot.val().target + "</h2><p style='margin-top: 0;'> on the " + date.getDate() + "-" + month + "-" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "</p></div>"
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

  var name = await get(child(ref(db), "users/" + uid)).then((snapshot)=>{
    return snapshot.val().name
  })
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
    target : name,
    amount : amount
  })
  document.getElementById("result").innerHTML = "lended succesfully"
}

async function update() {

  //salaires et prêts
  get(child(ref(db), "users"))
      .then((snapshot)=>{
          snapshot.forEach((dataSnapshot)=>{

              //salaires
              var name = String(dataSnapshot.val().name)
              var role = String(dataSnapshot.val().role)
              var bank = Number(dataSnapshot.val().bank)
              var verified = dataSnapshot.val().verified
              var dbref = ref(db, "users/" + dataSnapshot.key + "/bank")
              console.log(role, bank, verified,)
              
              if (verified == true) {
                  if (role == "sans-emploie") {
                      set(dbref, bank + 800)
                      set(ref(db, "transactions/" + Date.now()), {
                          name : "FDO",
                          target : name,
                          amount : 800
                      })
                      bank = bank + 800
                  } else if (role == "membre") {
                      set(dbref, bank + 1200)
                      set(ref(db, "transactions/" + Date.now()), {
                          name : "FDO",
                          target : name,
                          amount : 1200
                      })
                      bank = bank + 1200
                  } else if (role == "avocat" || role == "gestionnaire de propriété") {
                      set(dbref, bank + 1500)
                      set(ref(db, "transactions/" + Date.now()), {
                          name : "FDO",
                          target : name,
                          amount : 1500
                      })
                      bank = bank + 1500
                  } else if (role == "conseiller") {
                      set(dbref, bank + 2000)
                      set(ref(db, "transactions/" + Date.now()), {
                          name : "FDO",
                          target : name,
                          amount : 2000
                      })
                      bank = bank + 2000
                  } else if (role == "ministre" || role == "magistrat" || role == "premier ministre") {
                      set(dbref, bank + 2500)
                      set(ref(db, "transactions/" + Date.now()), {
                          name : "FDO",
                          target : name,
                          amount : 2500
                      })
                      bank = bank + 2500
                  } else if (role == "ministre des finances") {
                      set(dbref, bank + 3000)
                      set(ref(db, "transactions/" + Date.now()), {
                          name : "FDO",
                          target : name,
                          amount : 3000
                      })
                      bank = bank + 3000
                  } else if (role == "administrateur delegay") {
                      set(dbref, bank + 3500)
                      set(ref(db, "transactions/" + Date.now()), {
                          name : "FDO",
                          target : name,
                          amount : 3500
                      })
                      bank = bank + 3500
                  } else if (role == "administrateur supreme") {
                      set(dbref, bank + 4750)
                      set(ref(db, "transactions/" + Date.now()), {
                          name : "FDO",
                          target : name,
                          amount : 4750
                      })
                      bank = bank + 4750
                  }
              }

              //prêts
              dataSnapshot.forEach((snapshotDataSnapshot)=>{
                  if (snapshotDataSnapshot.key == "lend") {
                      snapshotDataSnapshot.forEach((dataSnapshotDataSnapshot)=>{
                          var payment = Number(dataSnapshotDataSnapshot.val().payments)
                          var weeks_left = Number(dataSnapshotDataSnapshot.val().weeks_left) - 1
                          set(ref(db, "users/" + dataSnapshot.key + "/bank"), bank - payment)
                          if (weeks_left == 0) {
                              remove(ref(db, "users/" + dataSnapshot.key + "/lend/" + dataSnapshotDataSnapshot.key))
                          } else {
                              set(ref(db, "users/" + dataSnapshot.key + "/lend/" + dataSnapshotDataSnapshot.key + "/weeks_left"), weeks_left)
                          }
                          set(ref(db, "transactions/" + Date.now()), {
                              name : name,
                              target : "bank",
                              amount : payment,
                          })
                      })
                  }
              })
          })
      })
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


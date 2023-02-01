// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
import { getDatabase, ref, set, get, child, push } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js"
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

const currentVersion = "1.1.1"

get(child(ref(db), "appInfo")).then((snapshot)=>{
  if (snapshot.val().version == "maintenance") {
    document.querySelector("header").insertAdjacentHTML("afterend",
      `<h1 style="color: orange;" id="alert">L'app est en cours de maintenance. Merci de revenir plus tard</h1>`
    )
    document.querySelector("section").remove()
  } else if (currentVersion != snapshot.val().version){
    document.querySelector("header").insertAdjacentHTML("afterend",
      `<h1 style="color: red;" id="alert">Vous utilisez une version obselete. Merci de mettre a jour l'app en la reinstallant</h1>
      <h1 style="color: red;" id="alert">(Version actuelle : v` + snapshot.val().version + ` ; Version intallé : v` + currentVersion + `)</h1>`
    )
    document.querySelector("section").remove()
  } else {
    indexPage();
    document.getElementById("header-text").addEventListener("click", indexPage)
  }
})

function indexPage() {
  if (document.querySelector("section") != null) {
    document.querySelector("section").remove()
  }
  document.querySelector("header").insertAdjacentHTML("afterend", 
    "<section id='info'>"
        + "<p>La SEULE application bancaire approuvée par la FDO</p>"
        + "<p>Intuitif et utilisation simple</p>"
        + "<p>Rejoignez <span style='font-weight: bolder;'>aujourd'hui</span> gratuitement!</p>"
        + "<a id='register-button'><button><p style='margin: 0;'>Créer un compte</p></button></a><br>"
        + "<a id='login-button'>Vous avez deja un compte ? Connectez-vous</a>"
    + "</section>"
  )
  document.getElementById("register-button").addEventListener("click", signupPage)
  document.getElementById("login-button").addEventListener("click", loginPage)
}


function signupPage () {
  document.querySelector("section").remove()
  document.querySelector("header").insertAdjacentHTML("afterend", 
    '<section id="login">'
      +'<h1>S'+"'"+'enregistrer</h1>'
      +'<input type="text" placeholder="Nom" id="name-input"><br>'
      +'<input type="email" placeholder="E-mail" id="email-input" style="margin-top: 20px;"><br>'
      +'<p style="font-size: 12px; color: red;margin-top: 0;" id="email-error"></p>'
      +'<input type="password" placeholder="Mot de Passe" id="pswrd-input" style="margin-top: 10px;"><br>'
      +'<p style="font-size: 12px; color: red;margin-top: 0;" id="pswrd-error"></p>'
      +'<input type="password" placeholder="Confirmez le mot de passe" style="margin-top: 10px;" id="pswrd-confirm-input"><br>'
      +'<p style="font-size: 12px; color: red;margin-top: 0;" id="value-error"></p>'
      +'<button style="margin-top: 20px;" id="signup-button">S'+"'"+'enregistrer</button><br>'
      +'<a id="login-button" style="margin-bottom: 20px;">Vous avez deja un compte ? Connectez-vous</a><p></p>'
      +'<a id="type-link">Plutôt pro ? Optez pour un compte entreprise</a>'
    +'</section>'
  )
  document.getElementById("signup-button").addEventListener("click", register)
  document.getElementById("login-button").addEventListener("click", loginPage)
  document.getElementById("type-link").addEventListener("click", eSignupPage)
}
function eSignupPage() {
  document.querySelector("section").remove()
  document.querySelector("header").insertAdjacentHTML("afterend", 
    `<section id="login">
    <h1>S'enregistrer (Entreprise)</h1>
    <input type="text" placeholder="Nom de l'Entreprise" id="name-input"><br>
    <input type="email" placeholder="E-mail" id="email-input" style="margin-top: 20px;"><br>
    <p style="font-size: 12px; color: red;margin-top: 0;" id="email-error"></p>
    <input type="password" placeholder="Mot de passe" id="pswrd-input" style="margin-top: 10px;"><br>
    <p style="font-size: 12px; color: red;margin-top: 0;" id="pswrd-error"></p>
    <input type="password" placeholder="Confirmez le mot de passe" style="margin-top: 10px;" id="pswrd-confirm-input"><br>
    <p style="font-size: 12px; color: red;margin-top: 0;" id="value-error"></p>
    <button style="margin-top: 20px;" id="signup-button">Sign-Up</button><br>
    <a id="login-button">Vous avez deja un compte ? Connectez-vous</a>
    <p id="signin-button"></p>
    <a id="type-link" style="margin-top: 20px;">Plutôt solo ? Optez pour un compte personnel</a>
    </section>`
  )
  document.getElementById("signup-button").addEventListener("click", registerEntreprise)
  document.getElementById("login-button").addEventListener("click", loginPage)
  document.getElementById("type-link").addEventListener("click", signupPage)
}
function loginPage() {
  document.querySelector("section").remove()
  document.querySelector("header").insertAdjacentHTML("afterend", 
    '<section id="login">'
    +'<h1>Se connecter</h1>'
    +'<p style="font-size: 12px; color: red;margin-top: 0;" id="email-error"></p>'
    +'<input type="email" placeholder="E-mail" id="email-input"><br>'
    +'<input type="password" placeholder="Mot de passe" style="margin-top: 20px;" id="pswrd-input"><br>'
    +'<button style="margin-top: 20px;" id="signin-button">Se connecter</button><br>'
    +"<a id='register-button'>Vous n'avez toujours pad compte ? Creer un compte</a>"
    +'</section>'
  )
  document.getElementById("signin-button").addEventListener("click", login)
  document.getElementById("register-button").addEventListener("click", signupPage)

  onAuthStateChanged(auth, (user) => {
    if (user) {
      var uid = user.uid
      db = getDatabase()
      get(child(ref(db), "users/" + uid + "/relogType")).then((snapshot)=>{
        if (snapshot.exists() == true) {
          if (snapshot.val() == "auto") {
            userPage()
          } else if (snapshot.val() == "pin") {
            document.querySelector("section").remove()
            document.querySelector("header").insertAdjacentHTML("afterend", 
              `<section id="login">
                <a id="logout">Log-Out</a>
                <p id="instruction">Entrez votre pin</p>
                <div style="display: flex; justify-content: center; align-items">
                  <img src="./style/unchecked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;" id="ring1">
                  <img src="./style/unchecked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;" id="ring2">
                  <img src="./style/unchecked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;" id="ring3">
                  <img src="./style/unchecked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;" id="ring4">
                </div>
                <div style="display: flex; justify-content: center; align-items: center;">
                  <div style="display: flex; justify-content: center; align-items: center; flex-direction: column; width: 250px;">
                    <div style="display: flex; justify-content: center; align-items: center;">
                      <p class="keypad" id="keypad-1">1</p>
                      <p class="keypad" id="keypad-2">2</p>
                      <p class="keypad" id="keypad-3">3</p>
                    </div>
                    <div style="display: flex; justify-content: center; align-items: center;">
                      <p class="keypad" id="keypad-4">4</p>
                      <p class="keypad" id="keypad-5">5</p>
                      <p class="keypad" id="keypad-6">6</p>
                    </div>
                    <div style="display: flex; justify-content: center; align-items: center;">
                      <p class="keypad" id="keypad-7">7</p>
                      <p class="keypad" id="keypad-8">8</p>
                      <p class="keypad" id="keypad-9">9</p>
                    </div>
                    <div style="display: flex; justify-content: center; align-items: center;">
                      <p class="keypad" id="keypad-back"><img src="./style/arrowLeft.png" style="width: 25px;"></p>
                      <p class="keypad" id="keypad-0">0</p>
                      <p class="keypad" id="keypad-enter"><img src="./style/arrowRight.png" style="width: 25px;"></p>
                    </div>
                  </div>
                </div>
                <p style="margin: 0; font-size: 14px; color:red;" id="pin-error"></p>
              </section>`
            )
            var pin1 = ""
            //keypad inputs
            document.getElementById("keypad-1").addEventListener("click", function() {
              if (pin1.length < 4) {
                pin1 = pin1 + "1"
                document.getElementById("ring" + pin1.length).src = "./style/checked-ring.svg"
              }
            })
            document.getElementById("keypad-2").addEventListener("click", function() {
              if (pin1.length < 4) {
                pin1 = pin1 + "2"
                document.getElementById("ring" + pin1.length).src = "./style/checked-ring.svg"
              }
            })
            document.getElementById("keypad-3").addEventListener("click", function() {
              if (pin1.length < 4) {
                pin1 = pin1 + "3"
                document.getElementById("ring" + pin1.length).src = "./style/checked-ring.svg"
              }
            })
            document.getElementById("keypad-4").addEventListener("click", function() {
              if (pin1.length < 4) {
                pin1 = pin1 + "4"
                document.getElementById("ring" + pin1.length).src = "./style/checked-ring.svg"
              }
            })
            document.getElementById("keypad-5").addEventListener("click", function() {
              if (pin1.length < 4) {
                pin1 = pin1 + "5"
                document.getElementById("ring" + pin1.length).src = "./style/checked-ring.svg"
              }
            })
            document.getElementById("keypad-6").addEventListener("click", function() {
              if (pin1.length < 4) {
                pin1 = pin1 + "6"
                document.getElementById("ring" + pin1.length).src = "./style/checked-ring.svg"
              }
            })
            document.getElementById("keypad-7").addEventListener("click", function() {
              if (pin1.length < 4) {
                pin1 = pin1 + "7"
                document.getElementById("ring" + pin1.length).src = "./style/checked-ring.svg"
              }
            })
            document.getElementById("keypad-8").addEventListener("click", function() {
              if (pin1.length < 4) {
                pin1 = pin1 + "8"
                document.getElementById("ring" + pin1.length).src = "./style/checked-ring.svg"
              }
            })
            document.getElementById("keypad-9").addEventListener("click", function() {
              if (pin1.length < 4) {
                pin1 = pin1 + "9"
                document.getElementById("ring" + pin1.length).src = "./style/checked-ring.svg"
              }
            })
            document.getElementById("keypad-0").addEventListener("click", function() {
              if (pin1.length < 4) {
                pin1 = pin1 + "0"
                document.getElementById("ring" + pin1.length).src = "./style/checked-ring.svg"
              }
            })
            document.getElementById("keypad-enter").addEventListener("click", function() {
              if (pin1.length == 4) {
                get(child(ref(db), "users/" + uid + "/pin")).then((snapshot)=>{
                  if (pin1 == snapshot.val()) {
                    userPage()
                  } else {
                    document.getElementById("pin-error").innerHTML = "Pin incorecte!"
                    document.getElementById("ring1").src = "./style/unchecked-ring.svg"
                    document.getElementById("ring2").src = "./style/unchecked-ring.svg"
                    document.getElementById("ring3").src = "./style/unchecked-ring.svg"
                    document.getElementById("ring4").src = "./style/unchecked-ring.svg"
                    pin1 = ""
                  }
                })
              }
            })
            document.getElementById("keypad-back").addEventListener("click", function() {
              if (pin1.length > 0) {
                document.getElementById("ring" + pin1.length).src = "./style/unchecked-ring.svg"
                pin1 = pin1.substring(0, pin1.length-1)
              }
            })
            document.getElementById("logout").addEventListener("click", signout)
          }
        } else {
          userPage()
        }
      })
    }
  })
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
      +'<div id="links">'
        +'<div style="margin-bottom: 5px;"><a id="transfer-button"><button><p style="margin: 0;">Transferer</p></button></a></div><br>'
        +'<div style="margin-bottom: 5px;"><a id="lend-button"><button><p style="margin: 0;">Empreinter</p></button></a></div><br>'
        +'<div style="margin-bottom: 5px;"><a id="factures-button"><button><p style="margin: 0;">Factures</p></button></a></div><br>'
        +'<div style="margin-bottom: 5px;"><a id="userlogs-button"><button><p style="margin: 0;">Historique</p></button></a></div><br>'
        +'<div style="margin-bottom: 5px;"><a id="options-button"><button><p style="margin: 0;">Options</p></button></a></div><br>'
      +'</div>'
      +'<a id="logout">Log-Out</a>'
    +'</section>'
  )
  onAuthStateChanged(auth, (user) => {
    if (user) {
      var uid = user.uid
      db = getDatabase()
      get(child(ref(db), "users/" + uid)).then((snapshot)=>{
        if (snapshot.val().entreprise == false) {
          document.getElementById("name").innerHTML = "Hey " + snapshot.val().name
          document.getElementById("id").innerHTML = "ID : " + uid
          document.getElementById("bank").innerHTML = Math.round(snapshot.val().bank) + " ß"
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
          } else if (userrole == "ministre des finances + horateur") {
            revenue.innerHTML = "3150 ß/week"
          } else if (userrole == "administrateur delegay") {
            revenue.innerHTML = "3500 ß/week"
          } else if (userrole == "avocat + premier ministre") {
            revenue.innerHTML = "4000 ß/week"
          } else if (userrole == "avocat + conseiller") {
            revenue.innerHTML = "3500 ß/week"
          } else if (userrole == "administrateur supreme") {
            revenue.innerHTML = "4750 ß/week"
          } else if (userrole == "administrateur supreme + magistrat") {
            revenue.innerHTML = "7250 ß/week"
          }
          if (snapshot.val().admin == true) {
            document.getElementById("logout").insertAdjacentHTML("beforebegin", 
              "<div style='margin-bottom: 5px'><a id='admin-button'><button><p style='margin: 0;'>Admin Pannel</p></button></a></div><br>"
            )
            document.getElementById("admin-button").addEventListener("click", adminPage)
          }
          
          document.getElementById("transfer-button").addEventListener("click", transferPage)
          document.getElementById("userlogs-button").addEventListener("click", userlogsPage)
          document.getElementById("lend-button").addEventListener("click", lendPage)
          document.getElementById("factures-button").addEventListener("click", facturePage)
          document.getElementById("options-button").addEventListener("click", optionsPage)
        } else {
          document.getElementById("name").innerHTML = "Hey " + snapshot.val().name
          document.getElementById("id").innerHTML = "ID : " + uid
          document.getElementById("bank").innerHTML = snapshot.val().bank + " ß"
          document.getElementById("links").innerHTML = ""
          document.getElementById("links").insertAdjacentHTML("afterbegin",
            "<div style='margin-bottom: 5px;'><a id='transfer-button'><button><p style='margin: 0;'>Transferer</p></button></a></div><br>" +
            "<div style='margin-bottom: 5px;'><a id='factures-button'><button><p style='margin: 0;'>Factures</p></button></a></div><br>" +
            "<div style='margin-bottom: 5px;'><a id='userlogs-button'><button><p style='margin: 0;'>Historique</p></button></a></div><br>"
            +'<div style="margin-bottom: 5px"><a id="options-button"><button><p style="margin: 0;">Options</p></button></a></div><br>'
          )
          document.getElementById("transfer-button").addEventListener("click", transferPage)
          document.getElementById("userlogs-button").addEventListener("click", userlogsPage)
          document.getElementById("factures-button").addEventListener("click", facturePage)
          document.getElementById("options-button").addEventListener("click", optionsPage)
        }
        if (snapshot.val().verified == false) {
          document.getElementById("name").insertAdjacentHTML("beforebegin", 
          "<h2 style='color: red; margin-bottom: 0px;'>Votre adresse email n'est pas vérifié!</h2><br>" + 
          "<p style='color: red; margin-top: 0px; font-size: 15px;' id='verify-text'>Faites une demande au près d'un administrateur</p>"
          )
          document.getElementById("links").remove()
        }
      })
      document.getElementById("logout").addEventListener("click", signout)
    } else {
      indexPage()
    }
  })
}
function transferPage() {
  document.querySelector("section").remove()
  document.querySelector("header").insertAdjacentHTML("afterend", 
    '<section id="login">'
      +'<a id="back-button">Retour</a>'
      +'<h1>Transférer</h1>'
      +'<p id="bank" style="margin-bottom: 0;"></p>'
      +'<input placeholder="montant" style="margin-top: 20px;" id="amount-input"><br>'
      +'<p style="margin: 0; font-size: 14px; color:red;" id="amount-error"></p>'
      +'<p style="font-size: 14px;">A cause des tax, le montant recue par le destinataire sera de 85% par rapport au montant indiqué<br>Donc, donc pour que votre destinataire recoive 100% de ce qu'+"'"+'il doit recevoir,<br>multipliez celui ci (le montant indiqué) par ≈1,18</p>'
      +'<select id="id-select" style="margin-top: 15px; width: 16.5pc;">'
        +'<option value="none">-- Please Choose an Option --</option>'
        +'<optgroup label="particuliers" id="particuliers">'
        +'</optgroup>'
        +'<optgroup label="entreprises" id="entreprises">'
        +'</optgroup>'
      +'</select>'
      +'<p style="margin: 0; font-size: 14px; color:red;" id="id-error"></p>'
      +'<input placeholder="motif (ex : repayer un ami)" style="margin-top: 20px;" id="motif-input"><br>'
      +'<p style="margin: 0; font-size: 14px; color:red;" id="motif-error"></p>'
      +'<button style="margin-top: 20px;" id="transfer-button"><p style="margin: 0px;">Envoyer</p></button><br>'
      +'<p style="font-size: 14px;">Les tax de virement sont a 15%</p>'
      +'<p style="color: green;" id="result"></p>'
    +'</section>'
  )
  onAuthStateChanged(auth, (user) => {
    if (user) {
      var uid = user.uid
      db = getDatabase()
      get(child(ref(db), "users/" + uid)).then((snapshot)=>{
        document.getElementById("bank").innerHTML = Math.round(snapshot.val().bank) + " ß"
      })
      get(child(ref(db), "users/"))
        .then((snapshot)=>{
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
      +'<h2 id="lendRequest-title">Demandes de prets</h2>'
      +'<div id="lendRequests" style="display: none;">'
      +'</div>'
      +'<button id="proprety"><h2 style="margin: 0;">Propriétés</h2></button><br>'
      +'<button id="weekly-update" style="margin-top: 20px;"><h2 style="margin: 0;">Mise a jour hebdomadaire</h2></button>'
    +'</section>'
  )
  onAuthStateChanged(auth, (user) => {
    if (user) {
      var uid = user.uid
      db = getDatabase()
      get(child(ref(db), "users/" + uid)).then((snapshot)=>{
        if (snapshot.val().admin == true) {
          document.getElementById("historique-title").addEventListener("click", function() {toggledisplay("historique")})
          document.getElementById("lendRequest-title").addEventListener("click", function() {toggledisplay("lendRequests")})
          adminlogs()
          showLendRequest()
          document.getElementById("weekly-update").addEventListener("click", update)
          document.getElementById("proprety").addEventListener("click", propretyPage)
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
    '<section id="login">'
      +'<a id="back-button">Retour</a>'
      +'<h1>Empreinter</h1>'
      +'<p id="bank" style="margin-bottom: 0;"></p>'
      +'<input placeholder="quantité" style="margin-top: 20px;" id="amount-input"><br>'
      +'<p style="margin: 0; font-size: 14px; color:red;" id="amount-error"></p>'
      +'<input placeholder="durée" style="margin-top: 20px;" id="time-input"><br>'
      +'<p style="margin: 0; font-size: 14px; color:red;" id="time-error"></p>'
      +'<input placeholder="motif (ex : s' + "'" + 'acheter un avocat)" style="margin-top: 20px;" id="motif-input"><br>'
      +'<p style="margin: 0; font-size: 14px; color:red;" id="motif-error"></p>'
      +'<p style="margin: 0; font-size: 14px;">Le temps mis fait varier le nombre de fois le remboursement est divisé<br>et determine la valeur de l' + "'" + 'interet dans la logique que 1 semaine = +0,5%.</p>'
      +'<p style="font-size: 14px;">Donc si vous metez quantité = 100000 et durée = 20,<br>vous devrez rembourser 110000 ß divisé en payements de 5500 ß</p>'
      +'<p style="font-size: 14px;">Si vous ne savez pas repayer la banque, votre solde sera negatif</p>'
      +'<button style="margin-top: 20px;" id="lend-button"><p style="margin: 0px;">Envoyer</p></button><br>'
      +'<p style="color: green;" id="result"></p>'
      +'<h2 id="active-lends">Liste d' + "'" + 'Empreints Actifs</h2>'
      +'<div id="activeList" style="display: none;">'
      +'</div>'
      +'<h2 id="request-lends">Demandes d' + "'" + 'Empreints</h2>'
      +'<div id="requestList" style="display: none;">'
      +'</div>'
    +'</section>'
  )
  onAuthStateChanged(auth, (user) => {
    if (user) {
      var uid = user.uid
      get(child(ref(db), "lendRequests")).then((snapshot)=>{
        snapshot.forEach((lendRequest)=>{
          if (lendRequest.val().tuid == uid) {
            document.getElementById("requestList").insertAdjacentHTML("afterbegin", 
              `<div class="transaction-data">
                <h3 style="margin: 15px 0 0 0;">En attente</h3>
                <div style="display: flex; justify-content: center; margin: 0px 20px;">
                  <p style="margin-top: 0; margin-bottom: 0px;">Montant : ` + lendRequest.val().amount + `ß</p>
                </div>
                <p style="margin-top: 0; margin-bottom: 0px;">Motif : ` + lendRequest.val().motif + `</p>
                <div style="display: flex; justify-content: center; margin: 0px 20px; align-items: center;">
                  <p style="font-size: 16px; margin-top: 0; margin-bottom: 15px;">Durée : ` + lendRequest.val().nb_weeks + ` (payments : `+ lendRequest.val().payments + `ß)</p>
                </div>
              </div>`
            )
          }
        })
      })
      get(child(ref(db), "users/" + uid + "/lend")).then((userData)=>{
        console.log(userData.val())
        userData.forEach((lend)=>{
          document.getElementById("activeList").insertAdjacentHTML("afterbegin", 
            `<div class="transaction-data">
              <h3 style="margin: 15px 0 0 0;">Actif</h3>
              <div style="display: flex; justify-content: center; margin: 0px 20px;">
                <p style="margin-top: 0; margin-bottom: 0px;">Montant : ` + lend.val().amount + `ß</p>
              </div>
              <p style="margin-top: 0; margin-bottom: 0px;">Motif : ` + lend.val().motif + `</p>
              <div style="display: flex; justify-content: center; margin: 0px 20px; align-items: center;">
                <p style="font-size: 16px; margin-top: 0; margin-bottom: 15px;">Durée restante : ` + lend.val().weeks_left + ` (payments : `+ lend.val().payments + `ß)</p>
              </div>
            </div>`
          )
        })
      })
      document.getElementById("lend-button").addEventListener("click", lend)
      document.getElementById("active-lends").addEventListener("click", function() {toggledisplay("activeList")})
      document.getElementById("request-lends").addEventListener("click", function() {toggledisplay("requestList")})
      document.getElementById("back-button").addEventListener("click", userPage)
    } else {
      indexPage()
    }
  })
}
function facturePage() {
  document.querySelector("section").remove()
  document.querySelector("header").insertAdjacentHTML("afterend", 
    `<section id="login">
    <a id="back-button">Retour</a>
    <h1>Liste de factures</h1>
    <p id="bank" style="margin-bottom: 15px;">test</p>
    <div id="list">
    </div>
    </section>`
  )
  onAuthStateChanged(auth, (user) => {
    if (user) {
      var uid = user.uid
      db = getDatabase()
      get(child(ref(db), "users/" + uid)).then((snapshot)=>{
        if (snapshot.val().entreprise == true) {
          document.getElementById("list").insertAdjacentHTML("beforebegin", 
            "<div style='margin-bottom: 5px;'><a id='newFacture-button'><button><p style='margin: 0;'>Créer nouveau</p></button></a></div><br>"
          )
          document.getElementById("newFacture-button").addEventListener("click", newFacturePage)
        }
        document.getElementById("bank").innerHTML = Math.round(snapshot.val().bank) + " ß"
        document.getElementById("back-button").addEventListener("click", userPage)
        factureList()
      })
    } else {
      indexPage()
    }
  })
}
function newFacturePage() {
  document.querySelector("section").remove()
  document.querySelector("header").insertAdjacentHTML("afterend", 
    `<section id="login">
    <h1>Créer une facture</h1>
    <p style="margin: 0; font-size: 14px; color:red;" id="id-error"></p>
    <select id="ids" style="width: 16.5pc; height: 3.5pc;">
        <option value="none">-- Please Choose an Option --</option>
        <optgroup label="particuliers" id="particuliers">
        </optgroup>
        <optgroup label="entreprises" id="entreprises">
        </optgroup>
    </select><br>
    <p style="margin: 0; font-size: 14px; color:red;" id="amount-error"></p>
    <input placeholder="montant" id="amount-input" style="margin: 10px; margin-bottom: 0;"><br>
    <p style="font-size: 14px;">A cause des tax, le revenue par rapport au montant indiqué sera de 80%<br>Donc, pour avoir un revenue a 100% par rapport au montant voullu,<br>multipliez celui ci (le montant) par 1,25</p>
    <p style="margin: 0; font-size: 14px; color:red;" id="motif-error"></p>
    <input placeholder="motif (ex : factures pour services données en temps que avocat)" id="motif-input" style="margin: 10px; margin-bottom: 0;"><br>
    <p style="margin: 0; font-size: 14px; color:red;" id="checkbox-error"></p>
    <div style="display: flex; justify-content: center; align-items: center;">
        <input type="checkbox" style="width: 2pc;"  id="confirm">
        <p style="font-weight: normal; font-size: 16px;">Êtes-vous sûr?</p>
    </div>
    <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 15px;">
        <button style="display: flex; justify-content: center; align-items: center;" id="creer"><p>Créer</p></button>
    </div>
    <a id="back-button">Retour</a>
    </section>`
  )
  onAuthStateChanged(auth, (user) => {
    if (user) {
      var uid = user.uid
      db = getDatabase()
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
      document.getElementById("back-button").addEventListener("click", facturePage)
      document.getElementById("creer").addEventListener("click", newFacture)
    } else {
      indexPage()
    }
  })
}
function optionsPage() {
  document.querySelector("section").remove()
  document.querySelector("header").insertAdjacentHTML("afterend",
  `<section id="login">
    <a id="back-button">Retour</a>
    <h1>Options du compte</h1>
    <p style="margin-bottom: 5px;">Changer le nom</p>
    <input id="name-input" placeholder="Nouveau Nom"><br>
    <p style="margin: 0; font-size: 14px; color:red;" id="name-error"></p>
    <p id="price" style="margin: 5px; font-size: 16px;"></p>
    <button style="margin-top: 5px;" id="change-name">Changer</button>
    <p style="margin-bottom: -5px;">Type de Reconnection</p>
    <div style="display: flex; justify-content: center; align-items: center;">
      <div style="display: flex; justify-content: center; align-items: start; flex-direction: column; width: 250px;">
        <div style="display: flex; justify-content: center; align-items: center;" id="relog-enp">
            <input type="checkbox" style="width: 1.5pc; margin: 0px; margin-right: 5px;" id="relog-enp-chck">
            <p style="font-weight: normal; font-size: 14px; margin : 0px;">Email et mdp <span style="color: green;">(sécure)</span></p>
        </div>
        <div style="display: flex; justify-content: center; align-items: center;" id="relog-pin">
            <input type="checkbox" style="width: 1.5pc; margin: 0px; margin-right: 5px;" id="relog-pin-chck">
            <p style="font-weight: normal; font-size: 14px; margin : 0px;">Code Pin <span style="color: orange;">(moyenement sécure)</span></p>
        </div>
        <div style="display: flex; justify-content: center; align-items: center;" id="relog-auto">
            <input type="checkbox" style="width: 1.5pc; margin: 0px; margin-right: 5px;" id="relog-auto-chck">
            <p style="font-weight: normal; font-size: 14px; margin : 0px;">Auto Relog <span style="color: red;">(pas sécure)</span></p>
        </div>
      </div>
    </div>
    <a id="createPin-button">Créer/Changer un/de code pin</a>
    <p>C'est tout, pour le moment</p>
  </section>`
  )
  onAuthStateChanged(auth, (user) => {
    if (user) {
      var uid = user.uid
      db = getDatabase()
      get(child(ref(db), "users/" + uid + "/changedName")).then((snapshot)=>{
        if (snapshot.exists() == true) {
          document.getElementById("price").innerHTML = "Prix = 1000 ß"
        } else {
          document.getElementById("price").innerHTML = "Prix = Gratuit (Offre de premier changement)"
        }
      })
      get(child(ref(db), "users/" + uid + "/relogType")).then((snapshot)=>{
        if (snapshot.exists() == true) {
          if (snapshot.val() == "auto") {
            document.getElementById("relog-auto-chck").checked = true
          } else if (snapshot.val() == "pin") {
            document.getElementById("relog-pin-chck").checked = true
          } else if (snapshot.val() == "enp") {
            document.getElementById("relog-enp-chck").checked = true
          }
        } else {
          document.getElementById("relog-auto-chck").checked = true
        }
      })
      document.getElementById("back-button").addEventListener("click", userPage)
      document.getElementById("change-name").addEventListener("click", changeName)
      document.getElementById("createPin-button").addEventListener("click", pinPage)
      document.getElementById("relog-auto").addEventListener("click", function() {
        set(ref(db, "users/" + uid + "/relogType"), "auto")
        document.getElementById("relog-enp-chck").checked = false
        document.getElementById("relog-pin-chck").checked = false
        document.getElementById("relog-auto-chck").checked = true
      })
      get(child(ref(db), "users/" + uid + "/pin")).then((snapshot)=>{
        if (snapshot.exists() == true) {
          document.getElementById("relog-pin").addEventListener("click", function() {
            set(ref(db, "users/" + uid + "/relogType"), "pin")
            document.getElementById("relog-enp-chck").checked = false
            document.getElementById("relog-pin-chck").checked = true
            document.getElementById("relog-auto-chck").checked = false
          })
        } else {
          document.getElementById("relog-pin-chck").disabled = true
          document.getElementById("relog-pin").insertAdjacentHTML("afterend", 
          `<p style="margin: -10px 0 0 0; font-size: 14px;">Vous devez d'abbord creer un code pin</p>`)
        }
      })
      document.getElementById("relog-enp").addEventListener("click", function() {
        set(ref(db, "users/" + uid + "/relogType"), "enp")
        document.getElementById("relog-enp-chck").checked = true
        document.getElementById("relog-pin-chck").checked = false
        document.getElementById("relog-auto-chck").checked = false
      })
    } else {
      indexPage()
    }
  })
}

function pinPage() {
  document.querySelector("section").remove()
  document.querySelector("header").insertAdjacentHTML("afterend",
  `<section id="login">
    <a id="back-button">Retour</a>
    <h1>Changer de Pin</h1>
    <p id="instruction">Entrez le nouveau Pin</p>
    <div style="display: flex; justify-content: center; align-items">
      <img src="./style/unchecked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;" id="ring1">
      <img src="./style/unchecked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;" id="ring2">
      <img src="./style/unchecked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;" id="ring3">
      <img src="./style/unchecked-ring.svg" height="32px" style="margin-top: 0; margin-bottom: 0px;" id="ring4">
    </div>
    <div style="display: flex; justify-content: center; align-items: center;">
      <div style="display: flex; justify-content: center; align-items: center; flex-direction: column; width: 250px;">
        <div style="display: flex; justify-content: center; align-items: center;">
          <p class="keypad" id="keypad-1">1</p>
          <p class="keypad" id="keypad-2">2</p>
          <p class="keypad" id="keypad-3">3</p>
        </div>
        <div style="display: flex; justify-content: center; align-items: center;">
          <p class="keypad" id="keypad-4">4</p>
          <p class="keypad" id="keypad-5">5</p>
          <p class="keypad" id="keypad-6">6</p>
        </div>
        <div style="display: flex; justify-content: center; align-items: center;">
          <p class="keypad" id="keypad-7">7</p>
          <p class="keypad" id="keypad-8">8</p>
          <p class="keypad" id="keypad-9">9</p>
        </div>
        <div style="display: flex; justify-content: center; align-items: center;">
          <p class="keypad" id="keypad-back"><img src="./style/arrowLeft.png" style="width: 25px;"></p>
          <p class="keypad" id="keypad-0">0</p>
          <p class="keypad" id="keypad-enter"><img src="./style/arrowRight.png" style="width: 25px;"></p>
        </div>
      </div>
    </div>
    <p style="margin: 0; font-size: 14px; color:red;" id="pin-error"></p>
  </section>`
  )
  onAuthStateChanged(auth, (user)=>{
    if (user) {
      var uid = user.uid
      db = getDatabase()
      var pin1 = ""
      var confirm = false
      var pin2 = ""
      //keypad inputs
      document.getElementById("keypad-1").addEventListener("click", function() {
        if (pin1.length < 4) {
          pin1 = pin1 + "1"
          document.getElementById("ring" + pin1.length).src = "./style/checked-ring.svg"
        } else if (pin2.length < 4 && confirm) {
          pin2 = pin2 + "1"
          document.getElementById("ring" + pin2.length).src = "./style/checked-ring.svg"
        }
      })
      document.getElementById("keypad-2").addEventListener("click", function() {
        if (pin1.length < 4) {
          pin1 = pin1 + "2"
          document.getElementById("ring" + pin1.length).src = "./style/checked-ring.svg"
        } else if (pin2.length < 4 && confirm) {
          pin2 = pin2 + "2"
          document.getElementById("ring" + pin2.length).src = "./style/checked-ring.svg"
        }
      })
      document.getElementById("keypad-3").addEventListener("click", function() {
        if (pin1.length < 4) {
          pin1 = pin1 + "3"
          document.getElementById("ring" + pin1.length).src = "./style/checked-ring.svg"
        } else if (pin2.length < 4 && confirm) {
          pin2 = pin2 + "3"
          document.getElementById("ring" + pin2.length).src = "./style/checked-ring.svg"
        }
      })
      document.getElementById("keypad-4").addEventListener("click", function() {
        if (pin1.length < 4) {
          pin1 = pin1 + "4"
          document.getElementById("ring" + pin1.length).src = "./style/checked-ring.svg"
        } else if (pin2.length < 4 && confirm) {
          pin2 = pin2 + "4"
          document.getElementById("ring" + pin2.length).src = "./style/checked-ring.svg"
        }
      })
      document.getElementById("keypad-5").addEventListener("click", function() {
        if (pin1.length < 4) {
          pin1 = pin1 + "5"
          document.getElementById("ring" + pin1.length).src = "./style/checked-ring.svg"
        } else if (pin2.length < 4 && confirm) {
          pin2 = pin2 + "5"
          document.getElementById("ring" + pin2.length).src = "./style/checked-ring.svg"
        }
      })
      document.getElementById("keypad-6").addEventListener("click", function() {
        if (pin1.length < 4) {
          pin1 = pin1 + "6"
          document.getElementById("ring" + pin1.length).src = "./style/checked-ring.svg"
        } else if (pin2.length < 4 && confirm) {
          pin2 = pin2 + "6"
          document.getElementById("ring" + pin2.length).src = "./style/checked-ring.svg"
        }
      })
      document.getElementById("keypad-7").addEventListener("click", function() {
        if (pin1.length < 4) {
          pin1 = pin1 + "7"
          document.getElementById("ring" + pin1.length).src = "./style/checked-ring.svg"
        } else if (pin2.length < 4 && confirm) {
          pin2 = pin2 + "7"
          document.getElementById("ring" + pin2.length).src = "./style/checked-ring.svg"
        }
      })
      document.getElementById("keypad-8").addEventListener("click", function() {
        if (pin1.length < 4) {
          pin1 = pin1 + "8"
          document.getElementById("ring" + pin1.length).src = "./style/checked-ring.svg"
        } else if (pin2.length < 4 && confirm) {
          pin2 = pin2 + "8"
          document.getElementById("ring" + pin2.length).src = "./style/checked-ring.svg"
        }
      })
      document.getElementById("keypad-9").addEventListener("click", function() {
        if (pin1.length < 4) {
          pin1 = pin1 + "9"
          document.getElementById("ring" + pin1.length).src = "./style/checked-ring.svg"
        } else if (pin2.length < 4 && confirm) {
          pin2 = pin2 + "9"
          document.getElementById("ring" + pin2.length).src = "./style/checked-ring.svg"
        }
      })
      document.getElementById("keypad-0").addEventListener("click", function() {
        if (pin1.length < 4) {
          pin1 = pin1 + "0"
          document.getElementById("ring" + pin1.length).src = "./style/checked-ring.svg"
        } else if (pin2.length < 4 && confirm) {
          pin2 = pin2 + "0"
          document.getElementById("ring" + pin2.length).src = "./style/checked-ring.svg"
        }
      })
      document.getElementById("keypad-enter").addEventListener("click", function() {
        if (pin1.length == 4 && confirm == false) {
          document.getElementById("ring1").src = "./style/unchecked-ring.svg"
          document.getElementById("ring2").src = "./style/unchecked-ring.svg"
          document.getElementById("ring3").src = "./style/unchecked-ring.svg"
          document.getElementById("ring4").src = "./style/unchecked-ring.svg"
          confirm = true
          document.getElementById("instruction").innerHTML = "Confirmez le nouveau Pin"
          console.log("pin = " + pin1)
        } else if (pin2.length == 4 && confirm == true) {
          if (pin1 != pin2) {
            document.getElementById("ring1").src = "./style/unchecked-ring.svg"
            document.getElementById("ring2").src = "./style/unchecked-ring.svg"
            document.getElementById("ring3").src = "./style/unchecked-ring.svg"
            document.getElementById("ring4").src = "./style/unchecked-ring.svg"
            confirm = false
            pin1 = ""
            pin2 = ""
            document.getElementById("pin-error").innerHTML = "Les codes pin ne sont pas les mêmes!<br>Merci de recommencer"
            document.getElementById("instruction").innerHTML = "Entrez le nouveau Pin"
          } else {
            set(ref(db, "users/" + uid + "/pin"), pin2)
            .then((snapshot)=>{optionsPage()})
          }
        }
      })
      document.getElementById("keypad-back").addEventListener("click", function() {
        if (confirm == false && pin1.length > 0) {
          document.getElementById("ring" + pin1.length).src = "./style/unchecked-ring.svg"
          pin1 = pin1.substring(0, pin1.length-1)
        } else if (confirm == true && pin2.length > 0) {
          document.getElementById("ring" + pin2.length).src = "./style/unchecked-ring.svg"
          pin2 = pin2.substring(0, pin2.length-1)
        }
      })
      //end
      document.getElementById("back-button").addEventListener("click", optionsPage)
    } else {
      loginPage()
    }
  })
}

function propretyPage() {
  document.querySelector("section").remove()
  document.querySelector("header").insertAdjacentHTML("afterend",
  `<section id="login">
    <a id="back-button">Retour</a>
    <h1>Créer une Propriéte</h1>
    <select id="id-select" style="margin: 15px; width: 16.5pc;">
      <option value="none">-- Please Choose an Option --</option>
      <optgroup label="particuliers" id="particuliers">
      </optgroup>
    </select>
    <p style="margin: 0; font-size: 14px; color:red;" id="id-error"></p>
    <input placeholder="Montant des taxs" id="amount-input" style="margin-bottom: 15px;">
    <p style="margin: 0; font-size: 14px; color:red;" id="amount-error"></p>
    <input placeholder="Notes (pas obligatoire)" id="note-input" style="margin-bottom: 15px;"><br>
    <button id="create-button"><p style="margin: 0;">Créer</p></button>
    <h2 id="see">Voir les propriétés</h2>
    <div id="property-list">
    </div>
  </section>`
  )
  onAuthStateChanged(auth, (user) => {
    if (user) {
      var db = getDatabase()
      var uid = user.uid
      get(child(ref(db), "users/" + uid)).then((snapshot)=>{
        if (snapshot.val().admin == true) {
          //create property part
          get(child(ref(db), "users/"))
          .then((snapshot)=>{
            snapshot.forEach((dataSnapshot)=>{
              if(dataSnapshot.val().entreprise == false) {
                document.getElementById("particuliers").insertAdjacentHTML("beforeend", 
                  "<option value='" + dataSnapshot.key + "' id='under-me'>" + dataSnapshot.val().name + " (id : " + dataSnapshot.key + ")" + "</option>"
                )
              }
            })
          })
          document.getElementById("create-button").addEventListener("click", function() {
            var db = getDatabase()
            var uid = user.uid
            var id = document.getElementById("id-select").value
            var amount = document.getElementById("amount-input").value
            var note = document.getElementById("note-input").value
            //check em hoes
            if (id == "none") {
              document.getElementById("id-error").innerHTML = "Merci de choisir un utilisateur"
              return
            }
            document.getElementById("id-error").innerHTML = ""
            if (/^\d+$/.test(amount) == false) {
              document.getElementById("amount-error").innerHTML = "Veuillez entrer un nombre (sans symbols)"
              return
            } else if (amount < 5) {
              document.getElementById("amount-error").innerHTML = "Merci d'indiquer 5ß ou plus"
              return
            }
            document.getElementById("amount-error").innerHTML = ""

            //add them hoes
            set(push(ref(db, "properties")), {
              uid : id,
              amount : Number(amount),
              note : note
            })
            propretyPage()
          })

          //manage properties part
          get(child(ref(db), "properties")).then((properties)=>{
            properties.forEach((snapshot)=>{
              get(child(ref(db), "users/" + snapshot.val().uid)).then((userData)=>{
                if (snapshot.val().note == "") {
                  var note = "(non fournie)"
                } else {
                  var note = snapshot.val().note
                }
                document.getElementById("property-list").insertAdjacentHTML("afterbegin",
                `<div class="property-data">
                  <p style="margin: 0;">Propriétaire : ` + userData.val().name + `</p>
                  <p style="margin: 0;">Taxes : ` + snapshot.val().amount + `</p>
                  <p style="margin-top: 0;">Note : ` + note + `</p>
                  <button style="width: 6pc; display: flex; align-items: center; justify-content: center;" id="delete-` + snapshot.key + `"><p>Suprimer</p></button>
                </div>`
                )
                document.getElementById("delete-" + snapshot.key).addEventListener("click", function() {
                  set(ref(db, "properties/" + snapshot.key), null)
                  propretyPage()
                })
              })
            })
          })
        } else {
          userPage()
        }
      })
      document.getElementById("back-button").addEventListener("click", adminPage)
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
    document.getElementById("email-error").innerHTML = 'Mettez un E-mail valide SVP'
    return
    // Don't continue running the code
  } else {
    document.getElementById("email-error").innerHTML = ''
  }
  if (validate_password(password, password2) == false) {
    document.getElementById("pswrd-error").innerHTML = "Les mots de passes sont trop court (<6 lettres) ou ne sont pas les memes"
    return
  } else {
    document.getElementById("pswrd-error").innerHTML = ''
  }
  if (validate_field(name) == false || validate_field(email) == false || validate_field(password) == false || validate_field(password2) == false) {
    document.getElementById("value-error").innerHTML = 'Un ou plusieurs des champs ne sont pas correctes'
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
      entreprise : false,
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
      document.getElementById("email-error").innerHTML = "Cette adresse émail est déja lié a un compte"
    }
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
    userPage()
  })
  .catch(function(error) {
    // Fi1rebase will use this to alert of its errors
    var error_code = error.code
    var error_message = error.message
    if (error_message == "Firebase: Error (auth/email-already-in-use).") {
      document.getElementById("email-error").innerHTML = "Email is already linked to an account!"
    }
  })
}

function login () {
  // Get all our input fields
  var email = document.getElementById('email-input').value
  var password = document.getElementById('pswrd-input').value

  // Validate input fields
  if (validate_email(email) == false) {
    document.getElementById("email-error").innerHTML = "Mettez un E-mail valide SVP"
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
    userPage()


  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var error_message = error.message

    if (error_message == "Firebase: Error (auth/wrong-password)." ) {
      document.getElementById("email-error").innerHTML = "Mauvais mot de passe ou adresse email"
    }
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
  var motif = document.getElementById("motif-input").value

  //Get database and usefull stuff
  var db = getDatabase()
  var user = auth.currentUser
  var uid = user.uid

  //test values inputed
  if (/^\d+$/.test(amount) == false) {
    document.getElementById("amount-error").innerHTML = "Veuillez entrer un nombre (sans symbols)"
    return
  } else if (amount < 5) {
    document.getElementById("amount-error").innerHTML = "Merci d'indiquer 5ß ou plus"
    return
  }
  document.getElementById("amount-error").innerHTML = ""
  if (id == "none") {
    document.getElementById("id-error").innerHTML = "Merci de selectioner un utilisateur valid"
    return
  }
  if (motif == "") {
    document.getElementById("motif-error").innerHTML = "Merci de mettre un motif"
    return
  }
  document.getElementById("motif-error").innerHTML = ""

  //get value of banks and test them
  var bank = await get(child(ref(db), "users/" + uid)).then((snapshot)=>{
    return snapshot.val().bank
  })
  if (bank < amount) {
    document.getElementById("amount-error").innerHTML = "Votre solde est insufisant"
    return
  }
  var tbank = await get(child(ref(db), "users/" + id))
    .then((snapshot)=>{
      return snapshot.val().bank
    })
    .catch(function(error) {
      document.getElementById("id-error").innerHTML = "Cet identifiant n'est pas lié a un compte"
      return -1
    })
  if (tbank != -1) {
    document.getElementById("id-error").innerHTML = ""
  } else {
    return
  }

  var fdoBank = await get(child(ref(db), "users/tO6sKQbxCaOsy3wvEQnJDkJrhgA2")).then((snapshot)=>{ return snapshot.val().bank })
  //Transfer amount
  await set(ref(db, "users/" + uid + "/bank"), bank-amount)
  await set(ref(db, "users/" + id + "/bank"), Number(tbank)+(Number(amount)*0.85))
  await set(ref(db, "users/tO6sKQbxCaOsy3wvEQnJDkJrhgA2/bank"), Number(fdoBank)+(Number(amount)*0.15))

  //Log transfer to database
  var name = await get(child(ref(db), "users/" + uid)).then((snapshot)=>{
    return snapshot.val().name
  })
  var tname = await get(child(ref(db), "users/" + id)).then((snapshot)=>{
    return snapshot.val().name
  })

  await set(ref(db, "transactions/" + Date.now()), {
    uid : uid,
    tuid : id,
    name : name,
    tname : tname,
    motif : motif + " (ttc)",
    amount : amount*0.85
  })

  //Done
  userPage()
}

async function userlogs() {
  var db = getDatabase()
  var user = auth.currentUser
  var uid = user.uid

  await get(child(ref(db),"transactions"))
    .then((snapshot)=>{
      snapshot.forEach((dataSnapshot)=>{
        var date = new Date(Number(dataSnapshot.key))
        var month = Number(date.getMonth()) + Number(1)
        if (dataSnapshot.val().name == "bank" && dataSnapshot.val().tname == uid) {
          document.getElementById("under-me").insertAdjacentHTML("afterend", 
            "<div class='transaction-data'><h2 style='margin-bottom: 0;'>Lended " + dataSnapshot.val().amount + " ß to the " + dataSnapshot.val().name + "</h2><p style='margin: 0;'> on the " + date.getDate() + "-" + month + "-" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "</p><p style='margin-top: 0;'>Motif : " + dataSnapshot.val().motif + "</p></div>"
          )
        } else if (dataSnapshot.val().tname == "bank" && dataSnapshot.val().name == uid) {
          document.getElementById("under-me").insertAdjacentHTML("afterend", 
            "<div class='transaction-data'><h2 style='margin-bottom: 0;'>Refunded " + dataSnapshot.val().amount + " ß to the " + dataSnapshot.val().tname + "</h2><p style='margin: 0;'> on the " + date.getDate() + "-" + month + "-" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "</p><p style='margin-top: 0;'>Motif : " + dataSnapshot.val().motif + "</p></div>"
          )
        } else if (dataSnapshot.val().uid == uid) {
          document.getElementById("under-me").insertAdjacentHTML("afterend", 
            "<div class='transaction-data'><h2 style='margin-bottom: 0;'>Transfered " + dataSnapshot.val().amount + " ß to " + dataSnapshot.val().tname + "</h2><p style='margin: 0;'> on the " + date.getDate() + "-" + month + "-" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "</p><p style='margin-top: 0;'>Motif : " + dataSnapshot.val().motif + "</p></div>"
          )
        } else if (dataSnapshot.val().tuid == uid) {
          document.getElementById("under-me").insertAdjacentHTML("afterend", 
            "<div class='transaction-data'><h2 style='margin-bottom: 0;'>Recieved " + dataSnapshot.val().amount + " ß from " + dataSnapshot.val().name + "</h2><p style='margin: 0;'> on the " + date.getDate() + "-" + month + "-" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "</p><p style='margin-top: 0;'>Motif : " + dataSnapshot.val().motif + "</p></div>"
          )
        }
        return false
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
            "<div class='transaction-data'><h2 style='margin-bottom: 0;'>" + dataSnapshot.val().tname + " lended " + dataSnapshot.val().amount + " ß to the " + dataSnapshot.val().name + "</h2><p style='margin-top: 0;'> on the " + date.getDate() + "-" + month + "-" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "</p></div>"
          )
        } else if (dataSnapshot.val().tname == "bank") {
          document.getElementById("under-me").insertAdjacentHTML("afterend", 
            "<div class='transaction-data'><h2 style='margin-bottom: 0;'>" + dataSnapshot.val().name + " refunded " + dataSnapshot.val().amount + " ß to the " + dataSnapshot.val().tname + "</h2><p style='margin-top: 0;'> on the " + date.getDate() + "-" + month + "-" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "</p></div>"
          )
        } else {
          document.getElementById("under-me").insertAdjacentHTML("afterend", 
            "<div class='transaction-data'><h2 style='margin-bottom: 0;'>" + dataSnapshot.val().name + " transfered " + dataSnapshot.val().amount + " ß to " + dataSnapshot.val().tname + "</h2><p style='margin-top: 0;'> on the " + date.getDate() + "-" + month + "-" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "</p></div>"
          )
        }
      })
    })
}

function toggledisplay(id) {
    (function(style) {
      style.display = style.display === 'none' ? '' : 'none';
    })(document.getElementById(id).style);
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
  var motif = document.getElementById("motif-input").value

  //check input values
  if (/^\d+$/.test(amount) == false) {
    document.getElementById("amount-error").innerHTML = "Merci d'indiquer une quantitée valid"
    return
  } else if (amount < 5) {
    document.getElementById("amount-error").innerHTML = "Merci d'indiquer 5ß ou plus"
    return
  }
  document.getElementById("amount-error").innerHTML = ""
  if (/^\d+$/.test(weeks) == false) {
    document.getElementById("time-error").innerHTML = "Merci d'indiquer une durée valid"
    return
  }
  document.getElementById("time-error").innerHTML = ""
  if (motif == "") {
    document.getElementById("motif-error").innerHTML = "Merci de mettre un motif"
    return
  }
  document.getElementById("motif-error").innerHTML = ""

  var i = weeks/2
  var payments = Math.round(amount * (1 + (i/100))/weeks)
  if ((weeks - Math.floor(weeks)) != 0 || weeks == 0 || /^\d+$/.test(amount) == false) {
    document.getElementById("time-error").innerHTML = "Entrez un nombre de semaine valide SVP (nombre sans virgule)"
    return
  } else {
    document.getElementById("time-error").innerHTML = ""
  }
  var name = await get(child(ref(db), "users/" + uid)).then((snapshot)=>{
    return snapshot.val().name
  })
  set(ref(db, "lendRequests/" + Date.now()), {
    name : "bank",
    uid : "bank",
    tuid : uid,
    tname : name,
    motif : motif,
    amount : amount,
    payments : payments,
    nb_weeks : weeks,
    intrest : i
  })
  lendPage()
}

async function acceptLend(lendID) {
  get(child(ref(db), "lendRequests/" + lendID)).then(async(snapshot)=>{
    var db = getDatabase()
    var user = auth.currentUser
    var uid = user.uid
    var bank = await get(child(ref(db), "users/" + snapshot.val().tuid)).then((dataSnapshot)=>{
      return dataSnapshot.val().bank
    })

    set(ref(db, "users/" + snapshot.val().tuid + "/bank"), Number(bank) + snapshot.val().amount)
    set(ref(db, "users/" + snapshot.val().tuid + "/lend/" + Date.now()), {
      amount : snapshot.val().amount,
      payments : snapshot.val().payments,
      weeks_left : snapshot.val().nb_weeks,
      motif : snapshot.val().motif,
      intrest : snapshot.val().intrest
    })

    set(ref(db, "transactions/" + Date.now()), {
      name : "bank",
      uid : "bank",
      tuid : snapshot.val().tuid,
      tname : snapshot.val().tname,
      motif : snapshot.val().motif,
      amount : snapshot.val().amount
    })
    set(ref(db, "lendRequests/" + lendID), null)
  })
  adminPage()
}

async function denyLend(lendID) {
  set(ref(db, "lendRequests/" + lendID), null)
  adminPage()
}

async function showLendRequest() {
  db = getDatabase()
  get(child(ref(db), "lendRequests")).then((requests)=>{
    requests.forEach((requestData)=>{
      var date = new Date(Number(requestData.key))
      var month = Number(date.getMonth()) + Number(1)
      document.getElementById("lendRequests").insertAdjacentHTML("afterbegin", 
          `<div class="transaction-data">
              <h3 style="margin-bottom: 0px;">Sortant</h3>
              <div style="display: flex; justify-content: center; margin: 0px 20px;">
                <p style="margin-top: 0; margin-right: 20px; margin-bottom: 0px;">Author : ` + requestData.val().tname + `</p>
                <p style="margin-top: 0; margin-bottom: 0px;">Montant : ` + requestData.val().amount + `ß</p>
              </div>
              <p style="margin-top: 0; margin-bottom: 0px;">Motif : ` + requestData.val().motif + `</p>
              <div style="display: flex; justify-content: center; margin: 0px 20px; align-items: center;">
                <p style="font-size: 16px; margin-top: 0; margin-bottom: 0px;">Durée : ` + requestData.val().nb_weeks + ` (payments : `+ requestData.val().payments + `ß)</p>
              </div>
              <div style="display: flex; justify-content: center; margin: 0px 20px; align-items: center;">
                <button style="width: 5pc; display: flex; align-items: center; justify-content: center; margin-left: 20px;" id="accept-` + requestData.key + `"><p>Accepter</p></button>
                <button style="width: 5pc; display: flex; align-items: center; justify-content: center; margin-left: 20px;" id="deny-` + requestData.key + `"><p>Refuser</p></button>
              </div>
            </div>`
          )
      document.getElementById("accept-"+requestData.key).addEventListener("click", () => {
        acceptLend(requestData.key)
      })
      document.getElementById("deny-"+requestData.key).addEventListener("click", () => {
        denyLend(requestData.key)
      })
    })
  })

}

async function newFacture() {
  var db = getDatabase()
  var user = auth.currentUser
  var uid = user.uid

  //input values
  var target = document.getElementById("ids").value
  var amount = Number(document.getElementById("amount-input").value)
  var motif = document.getElementById("motif-input").value
  var confirm = document.getElementById("confirm").checked
  //test input values
  if (target == "none") {
    document.getElementById("id-error").innerHTML = "Veuillez entrer un utilisateur existant"
    return
  }
  document.getElementById("id-error").innerHTML = ""
  if (/^\d+$/.test(amount) == false) {
    document.getElementById("amount-error").innerHTML = "Veuillez entrer un nombre (sans symbols)"
    return
  } else if (amount < 5) {
    document.getElementById("amount-error").innerHTML = "Merci d'indiquer 5ß ou plus"
    return
  }
  document.getElementById("amount-error").innerHTML = ""
  if (motif == "") {
    document.getElementById("motif-error").innerHTML = "Merci de mettre un motif"
    return
  }
  document.getElementById("motif-error").innerHTML = ""
  if (confirm == false) {
    document.getElementById("checkbox-error").innerHTML = "Veuillez confirmer votre choix"
    return
  }
  document.getElementById("checkbox-error").innerHTML = ""
  //create the facture
  var name = await get(child(ref(db), "users/" + uid)).then((snapshot)=>{
    return snapshot.val().name
  })
  var tname = await get(child(ref(db), "users/" + target)).then((snapshot)=>{
    return snapshot.val().name
  })
  await set(ref(db, "factures/" + Date.now()), {
    uid : uid,
    tuid : target,
    name : name,
    tname : tname,
    motif : motif,
    amount : amount
  })
  //done
  facturePage()
}

async function factureList() {
  var db = getDatabase()
  var user = auth.currentUser
  var uid = user.uid

  get(child(ref(db), "factures")).then((snapshot)=>{
    snapshot.forEach((dataSnapshot)=>{
      var date = new Date(Number(dataSnapshot.key))
      var today = new Date()
      var daysSince = Math.floor((today.getTime() - date.getTime()) / (1000 * 3600 * 24))
      if (dataSnapshot.val().uid == uid) {
        var name = dataSnapshot.val().tname
        if (dataSnapshot.val().rappel3 != null) {
          var lastRemind = new Date(Number(dataSnapshot.val().rappel3))
          var daysSinceLastRemind = Math.floor((today.getTime() - lastRemind.getTime()) / (1000 * 3600 * 24))
          document.getElementById("list").insertAdjacentHTML("beforeend", 
          `<div class="transaction-data">
              <h3 style="margin-bottom: 0px;">Sortant</h3>
              <div style="display: flex; justify-content: center; margin: 0px 20px;">
                <p style="margin-top: 0; margin-right: 20px; margin-bottom: 0px;">Destinataire : ` + name + `</p>
                <p style="margin-top: 0; margin-bottom: 0px;">Montant : ` + dataSnapshot.val().amount + `ß ttc</p>
              </div>
              <p style="margin-top: 0; margin-bottom: 0px;">Motif : ` + dataSnapshot.val().motif + `</p>
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
                <p style="margin-top: 0; margin-right: 20px; margin-bottom: 0px;">Destinataire : ` + name + `</p>
                <p style="margin-top: 0; margin-bottom: 0px;">Montant : ` + dataSnapshot.val().amount + `ß ttc</p>
              </div>
              <p style="margin-top: 0; margin-bottom: 0px;">Motif : ` + dataSnapshot.val().motif + `</p>
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
                <button style="width: 5pc; display: flex; align-items: center; justify-content: center; margin-left: 20px;" id="remind-` + dataSnapshot.key + `"><p>Rappeler</p></button>
              </div>
            </div>`
          )
          if (daysSinceLastRemind >= 3) {
            document.getElementById("remind-"+dataSnapshot.key).addEventListener("click", () => {
              remind(dataSnapshot.key)
            })
          } else {
            document.getElementById("remind-"+dataSnapshot.key).disabled = true
          }
        } else if (dataSnapshot.val().rappel1 != null) {
          var lastRemind = new Date(Number(dataSnapshot.val().rappel1))
          var daysSinceLastRemind = Math.floor((today.getTime() - lastRemind.getTime()) / (1000 * 3600 * 24))
          document.getElementById("list").insertAdjacentHTML("beforeend", 
          `<div class="transaction-data">
              <h3 style="margin-bottom: 0px;">Sortant</h3>
              <div style="display: flex; justify-content: center; margin: 0px 20px;">
                <p style="margin-top: 0; margin-right: 20px; margin-bottom: 0px;">Destinataire : ` + name + `</p>
                <p style="margin-top: 0; margin-bottom: 0px;">Montant : ` + dataSnapshot.val().amount + `ß ttc</p>
              </div>
              <p style="margin-top: 0; margin-bottom: 0px;">Motif : ` + dataSnapshot.val().motif + `</p>
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
                <button style="width: 5pc; display: flex; align-items: center; justify-content: center; margin-left: 20px;" id="remind-` + dataSnapshot.key + `"><p>Rappeler</p></button>
              </div>
            </div>`
          )
          if (daysSinceLastRemind >= 3) {
            document.getElementById("remind-"+dataSnapshot.key).addEventListener("click", () => {
              remind(dataSnapshot.key)
            })
          } else {
            document.getElementById("remind-"+dataSnapshot.key).disabled = true
          }
        } else {
          document.getElementById("list").insertAdjacentHTML("beforeend", 
          `<div class="transaction-data">
              <h3 style="margin-bottom: 0px;">Sortant</h3>
              <div style="display: flex; justify-content: center; margin: 0px 20px;">
                <p style="margin-top: 0; margin-right: 20px; margin-bottom: 0px;">Destinataire : ` + name + `</p>
                <p style="margin-top: 0; margin-bottom: 0px;">Montant : ` + dataSnapshot.val().amount + `ß ttc</p>
              </div>
              <p style="margin-top: 0; margin-bottom: 0px;">Motif : ` + dataSnapshot.val().motif + `</p>
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
                <button style="width: 5pc; display: flex; align-items: center; justify-content: center; margin-left: 20px;" id="remind-` + dataSnapshot.key + `"><p>Rappeler</p></button>
              </div>
            </div>`
          )
          if (daysSinceLastRemind >= 3) {
            document.getElementById("remind-"+dataSnapshot.key).addEventListener("click", () => {
              remind(dataSnapshot.key)
            })
          } else {
            document.getElementById("remind-"+dataSnapshot.key).disabled = true
          }
        }
      }
      if (dataSnapshot.val().tuid == uid) {
        var name = dataSnapshot.val().name
        if (dataSnapshot.val().rappel3 != null) {
          var lastRemind = new Date(Number(dataSnapshot.val().rappel3))
          var daysSinceLastRemind = Math.floor((today.getTime() - lastRemind.getTime()) / (1000 * 3600 * 24))
          document.getElementById("list").insertAdjacentHTML("afterbegin",
            `<div class="transaction-data">
              <h3 style="margin-bottom: 0px;">Reçue</h3>
              <div style="display: flex; justify-content: center; margin: 0px 20px;">
                <p style="margin-top: 0; margin-right: 20px; margin-bottom: 0px;">Auteur : ` + name + `</p>
                <p style="margin-top: 0; margin-bottom: 0px;">Montant : ` + dataSnapshot.val().amount + `ß ttc</p>
              </div>
              <p style="margin-top: 0; margin-bottom: 0px;">Motif : ` + dataSnapshot.val().motif + `</p>
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
          document.getElementById("list").insertAdjacentHTML("afterbegin",
            `<div class="transaction-data">
              <h3 style="margin-bottom: 0px;">Reçue</h3>
              <div style="display: flex; justify-content: center; margin: 0px 20px;">
                <p style="margin-top: 0; margin-right: 20px; margin-bottom: 0px;">Auteur : ` + name + `</p>
                <p style="margin-top: 0; margin-bottom: 0px;">Montant : ` + dataSnapshot.val().amount + `ß ttc</p>
              </div>
              <p style="margin-top: 0; margin-bottom: 0px;">Motif : ` + dataSnapshot.val().motif + `</p>
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
                <p style="margin-top: 0; margin-bottom: 0px;">Montant : ` + dataSnapshot.val().amount + `ß ttc</p>
              </div>
              <p style="margin-top: 0; margin-bottom: 0px;">Motif : ` + dataSnapshot.val().motif + `</p>
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
                <p style="margin-top: 0; margin-bottom: 0px;">Montant : ` + dataSnapshot.val().amount + `ß ttc</p>
              </div>
              <p style="margin-top: 0; margin-bottom: 0px;">Motif : ` + dataSnapshot.val().motif + `</p>
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
                <button style="width: 5pc; display: flex; align-items: center; justify-content: center; margin-left: 20px;" id="pay-` + dataSnapshot.key + `"><p>Payer</p></button>
              </div>
            </div>`
          )
        }
        if (dataSnapshot.val().rappel3 == null) {
          document.getElementById("pay-"+dataSnapshot.key).addEventListener("click", () => {
            pay(dataSnapshot.key)
          })
        }
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
    if (snapshot.val().rappel1 == null) {
      var date = new Date(snapshot.key)
      await set(ref(db, "factures/" + facture + "/rappel1"), Date.now())
    } else if (snapshot.val().rappel2 == null) {
      var date = new Date(snapshot.val().rappel2)
      await set(ref(db, "factures/" + facture + "/rappel2"), Date.now())
    } else if (snapshot.val().rappel3 == null) {
      var date = new Date(snapshot.val().rappel2)
      await set(ref(db, "factures/" + facture + "/rappel3"), Date.now())
    }
  })

  facturePage()
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
  var benefUid = await get(child(ref(db), "factures/" + facture)).then((snapshot) => { return snapshot.val().uid })
  var benefBank = await get(child(ref(db), "users/" + benefUid)).then((snapshot) => { return snapshot.val().bank })
  //update users bank
  await set(ref(db, "users/" + uid + "/bank"), Number(bank) - Number(fAmount))

  //update benef bank
  await set(ref(db, "users/" + benefUid + "/bank"), Number(benefBank) + Number(fAmount)*0.8)

  //

  //log transaction
  var name = await get(child(ref(db), "users/" + uid)).then((snapshot)=>{
    return snapshot.val().name
  })
  var tname = await get(child(ref(db), "users/" + benefUid)).then((snapshot)=>{
    return snapshot.val().name
  })
  await set(ref(db, "transactions/" + Date.now()), {
    name : name,
    tname : tname,
    uid : uid,
    tuid : benefUid,
    motif : "payment de facture (=> Id facture : " + facture + ") ttc", 
    amount : fAmount*0.8,
  })

  //log facture
  get(child(ref(db), "factures/" + facture)).then(async(snapshot)=>{
    if (snapshot.val().rappel3 != null) {
      await set(ref(db, "payedFactures/" + facture), {
        uid : snapshot.val().uid,
        tuid : snapshot.val().tuid,
        name : snapshot.val().name,
        tname : snapshot.val().tname,
        motif : snapshot.val().motif,
        amount : snapshot.val().amount,
        payTime : Date.now(),
        rappel1 : snapshot.val().rappel1,
        rappel2 : snapshot.val().rappel2,
        rappel3 : snapshot.val().rappel3
      })
    } else if (snapshot.val().rappel2 != null) {
      await set(ref(db, "payedFactures/" + facture), {
        uid : snapshot.val().uid,
        tuid : snapshot.val().tuid,
        name : snapshot.val().name,
        tname : snapshot.val().tname,
        motif : snapshot.val().motif,
        amount : snapshot.val().amount,
        payTime : Date.now(),
        rappel1 : snapshot.val().rappel1,
        rappel2 : snapshot.val().rappel2
      })
    } else if (snapshot.val().rappel1 != null) {
      await set(ref(db, "payedFactures/" + facture), {
        uid : snapshot.val().uid,
        tuid : snapshot.val().tuid,
        name : snapshot.val().name,
        tname : snapshot.val().tname,
        motif : snapshot.val().motif,
        amount : snapshot.val().amount,
        payTime : Date.now(),
        rappel1 : snapshot.val().rappel1
      })
    } else {
      await set(ref(db, "payedFactures/" + facture), {
        uid : snapshot.val().uid,
        tuid : snapshot.val().tuid,
        name : snapshot.val().name,
        tname : snapshot.val().tname,
        motif : snapshot.val().motif,
        amount : snapshot.val().amount,
        payTime : Date.now(),
      })
    }
  })
  //remove facture
  await set(ref(db, "factures/" + facture), null)

  facturePage()
}

async function changeName() {
  var db = getDatabase()
  var user = auth.currentUser
  var uid = user.uid

  name = document.getElementById("name-input").value

  //verify if something is written
  if (name == "") {
    document.getElementById("name-error").innerHTML = "Merci d'indiquer quelque chose"
    return
  } else {
    document.getElementById("name-error").innerHTML = ""
  }

  //verify if there is enough money on account
  var i = 0
  get(child(ref(db), "users/" + uid)).then((snapshot)=>{
    if (snapshot.val().changedName != null) {
      if (snapshot.val().bank < 1000) {
        i = 1
      }
    }
  })
  if (i == 1) {
    document.getElementById("name-error").innerHTML = "Solde insuffisant"
    return
  } else {
    document.getElementById("name-error").innerHTML = ""
  }

  //change name and remove money
  get(child(ref(db), "users/" + uid)).then(async(snapshot)=>{
    if (snapshot.val().changedName != null) {
      //transfer money to fdo
      var bank = snapshot.val().bank
      set(ref(db, "users/" + uid + "/bank"), bank - 1000)
      var fdoBank = get(child(ref(db), "users/tO6sKQbxCaOsy3wvEQnJDkJrhgA2/bank")).then(async(fdoSnapshot)=>{ return fdoSnapshot.val()})
      set(ref(db, "users/tO6sKQbxCaOsy3wvEQnJDkJrhgA2/bank"), fdoBank + 1000)
      //log transaction
      set(ref(db, "transactions/" + Date.now()), {
      name : snapshot.val().name,
      tname : "FDO",
      uid : uid,
      tuid : "tO6sKQbxCaOsy3wvEQnJDkJrhgA2",
      motif : "changement de nom (=> " + name + ")",
      amount : 1000
      })
    }
    //change name
    set(ref(db, "users/" + uid + "changedName"), true)
    set(ref(db, "users/" + uid + "/name" ), name)
  })
  userPage()
}

async function update() {
  
  var db = getDatabase()
  var user = auth.currentUser
  var uid = user.uid
  var i = 0
  var tax = 0
  
  get(child(ref(db),"users/tO6sKQbxCaOsy3wvEQnJDkJrhgA2")).then((fdoSnapshot)=>{
    var fdoBank = fdoSnapshot.val().bank
    get(child(ref(db), "users")).then((snapshot)=>{
      snapshot.forEach((dataSnapshot)=>{
        if (dataSnapshot.val().verified == true && dataSnapshot.val().entreprise == false) {
          //salaires
          var name = String(dataSnapshot.val().name)
          var role = String(dataSnapshot.val().role)
          var bank = Number(dataSnapshot.val().bank)
          var dbref = ref(db, "users/" + dataSnapshot.key + "/bank")

          if (role == "sans-emploie") {
            set(dbref, bank + (800*0.80))
            var salaire = 800*0.80
            tax = tax + 800*0.20
          } else if (role == "membre") {
            set(dbref, bank + (1200*0.80))
            var salaire = 1200*0.80
            tax = tax + 1200*0.20
          } else if (role == "avocat" || role == "gestionnaire de propriété") {
            set(dbref, bank + (1500*0.80))
            var salaire = 1500*0.80
            tax = tax + 1500*0.20
          } else if (role == "conseiller") {
            set(dbref, bank + (2000*0.80))
            var salaire = 2000*0.80
            tax = tax + 2000*0.20
          } else if (role == "ministre" || role == "magistrat" || role == "premier ministre") {
            set(dbref, bank + (2500*0.80))
            var salaire = 2500*0.80
            tax = tax + 2500*0.20
          } else if (role == "ministre des finances + horateur") {
            set(dbref, bank + (3150*0.80))
            var salaire = 3150*0.80
            tax = tax + 3150*0.20
          } else if (role == "administrateur delegay") {
            set(dbref, bank + (3500*0.80))
            var salaire = 3500*0.80
            tax = tax + 3500*0.20
          } else if (role == "administrateur supreme") {
            set(dbref, bank + (4750*0.80))
            var salaire = 4750*0.80
            tax = tax + 4750*0.20
          } else if (role == "avocat + conseiller") {
            set(dbref, bank + (3500*0.80))
            var salaire = 3500*0.80
            tax = tax + 3500*0.20
          }  else if (role == "avocat + premier ministre") {
            set(dbref, bank + (4000*0.80))
            var salaire = 4000*0.80
            tax = tax + 4000*0.20
          } else if (role == "administrateur supreme + magistrat") {
            set(dbref, bank + (7250*0.80))
            var salaire = 7250*0.80
            tax = tax + 7250*0.20
          }
          console.log(fdoBank + tax, name)
          
          set(ref(db, "transactions/" + (Date.now() + i)), {
            name : "FDO",
            tname : name,
            uid : "tO6sKQbxCaOsy3wvEQnJDkJrhgA2",
            tuid : dataSnapshot.key,
            motif : "salaire (ttc)",
            amount : salaire
          })

          // prets
          dataSnapshot.forEach((snapshotDataSnapshot)=>{
            if (snapshotDataSnapshot.key == "lend") {
              snapshotDataSnapshot.forEach((dataSnapshotDataSnapshot)=>{
                var payment = Number(dataSnapshotDataSnapshot.val().payments)
                var weeks_left = Number(dataSnapshotDataSnapshot.val().weeks_left) - 1
                set(ref(db, "users/" + dataSnapshot.key + "/bank"), bank - payment)
                tax = tax + payment*0.2
                if (weeks_left == 0) {
                  set(ref(db, "users/" + dataSnapshot.key + "/lend/" + dataSnapshotDataSnapshot.key), null)
                } else {
                  set(ref(db, "users/" + dataSnapshot.key + "/lend/" + dataSnapshotDataSnapshot.key + "/weeks_left"), weeks_left)
                }
                set(ref(db, "transactions/" + (Date.now() + i + 100)), {
                  name : name,
                  tname : "bank",
                  uid : dataSnapshot.key,
                  tuid : "bank",
                  motif : "remboursement de pret",
                  amount : payment,
                })  
                i = 0
                while (i < 100) {
                  i = i+1

                }
                set(ref(db, "transactions/" + (Date.now() + i + 200)), {
                  name : "bank",
                  tname : "FDO",
                  uid : "bank",
                  tuid : "tO6sKQbxCaOsy3wvEQnJDkJrhgA2",
                  motif : "impot entrprise (=> remboursement pret)",
                  amount : payment*0.20
                })
              })
            }
          })
          
          //impots sur la fortune
          if (dataSnapshot.val().bank > 18000) {
            tax = tax + (dataSnapshot.val().bank)*0.05
            set(ref(db, "users/" + dataSnapshot.key + "/bank"), dataSnapshot.val().bank - (dataSnapshot.val().bank*0.05))
            set(ref(db, "transactions/" + (Date.now() + i + 300)), {
              name : name,
              tname : "FDO",
              uid : dataSnapshot.key,
              tuid : "tO6sKQbxCaOsy3wvEQnJDkJrhgA2",
              motif : "impot sur le salaire",
              amount : (dataSnapshot.val().bank*0.05)
            })
          }
        }
        i = i + 2
      })
    get(child(ref(db), "properties")).then((properties)=>{
      var ptax = 0
      properties.forEach((property)=>{
        get(child(ref(db), "users/" + property.val().uid)).then((userData)=>{
          var bank = userData.val().bank
          ptax = ptax + property.val().amount
          set(ref(db, "users/" + property.val().uid + "/bank"), bank - property.val().amount)
          set(ref(db, "transactions/" + (Date.now() + i + 400)), {
            name : userData.val().name,
            tname : "FDO",
            uid : property.val().uid,
            tuid : "tO6sKQbxCaOsy3wvEQnJDkJrhgA2",
            motif : "impot propriété",
            amount : property.val().amount
          })
        })
        i = i + 2
      })
      get(child(ref(db), "users/tO6sKQbxCaOsy3wvEQnJDkJrhgA2/bank")).then((fdoBankSnapshot)=>{
        set(ref(db, "users/tO6sKQbxCaOsy3wvEQnJDkJrhgA2/bank"), fdoBankSnapshot.val() + ptax)
        set(ref(db, "transactions/" + (Date.now() + i + 500)), {
          name : "utilisateurs",
          tname : "FDO",
          uid : "null",
          tuid : "tO6sKQbxCaOsy3wvEQnJDkJrhgA2",
          motif : "impots toutes propriétés",
          amount : ptax
        })
      })
    })
      set(ref(db, "users/tO6sKQbxCaOsy3wvEQnJDkJrhgA2/bank"), fdoBank + tax)
      set(ref(db, "transactions/" + (Date.now() + i + 600)), {
        name : "utilisateurs",
        tname : "FDO",
        uid : "null",
        tuid : "tO6sKQbxCaOsy3wvEQnJDkJrhgA2",
        motif : "impots salaire",
        amount : tax
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

// ZE END
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
import { getDatabase, ref, set, get, child, remove } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js"
import { datetimeString } from "firebase-tools/lib/utils";
//import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
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
var db = getDatabase();


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

//make button work
document.getElementById("weekly-update").addEventListener("click", update)
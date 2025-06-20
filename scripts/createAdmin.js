// scripts/createAdmin.js
import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  doc,
  updateDoc,
  collection,
  getDocs
} from 'firebase/firestore'

// Config do Firebase (idêntica à sua)
const firebaseConfig = {
  apiKey: "AIzaSyBw1B0kDrCvKOZHCE9c-lpWff-aL0YXISI",
  authDomain: "autismoemfoco-9117e.firebaseapp.com",
  projectId: "autismoemfoco-9117e",
  storageBucket: "autismoemfoc...appspot.com",
  messagingSenderId: "241125743479",
  appId: "1:241125743479:web:8a11e9ae8021b6a95b1f72",
  measurementId: "G-MTHJCGZ3EJ"
}

// Inicializa
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// E‑mail do admin
const adminEmail = "admin@example.com"

async function promoteToAdmin() {
  const usersCollection = collection(db, 'users')
  const userSnapshot = await getDocs(usersCollection)

  let adminUser = null
  userSnapshot.forEach(snapshot => {
    const data = snapshot.data()
    if (data.email === adminEmail) {
      adminUser = { id: snapshot.id, ...data }
    }
  })

  if (!adminUser) {
    console.log(`❌ Usuário ${adminEmail} não encontrado.`)
    return
  }

  await updateDoc(doc(db, 'users', adminUser.id), { userType: 'admin' })
  console.log(`✅ Usuário ${adminEmail} promovido a admin!`)
}

promoteToAdmin()
  .catch(console.error)

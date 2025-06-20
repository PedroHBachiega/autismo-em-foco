// scripts/promoteAdmin.js
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// suporte a __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// caminho pro JSON de credenciais
const serviceAccountPath = path.join(__dirname, './autismoemfoco-9117e-firebase-adminsdk-fbsvc-cba7ffeec2.json');
const serviceAccount = JSON.parse(await readFile(serviceAccountPath, 'utf8'));

// inicializa o Admin SDK
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// email alvo
const adminEmail = 'admin@autismoemfoco.com';

async function promoteToAdmin() {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.get();

  // 1) lista todos os emails existentes
  console.log('=== Emails cadastrados em users/ ===');
  snapshot.forEach(doc => {
    console.log(`• [${doc.id}] ${doc.data().email}`);
  });
  console.log('==================================');

  // 2) tenta promover
  let found = false;
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    if (data.email === adminEmail) {
      await usersRef.doc(docSnap.id).update({ userType: 'admin' });
      console.log(`✅ Usuário ${adminEmail} promovido a admin.`);
      found = true;
      break;
    }
  }

  if (!found) {
    console.log(`❌ Usuário com email ${adminEmail} não encontrado.`);
  }
}

promoteToAdmin().catch(console.error);

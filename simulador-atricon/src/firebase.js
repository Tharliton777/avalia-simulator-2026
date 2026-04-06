import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // NOVO: Importando o Firestore (Banco na Nuvem)

// A sua chave secreta do cofre
const firebaseConfig = {
  apiKey: "AIzaSyAPMG3dWe_qpyUXU-FHAbLfuaquSzuRqAc",
  authDomain: "simulador-atricon-2026.firebaseapp.com",
  projectId: "simulador-atricon-2026",
  storageBucket: "simulador-atricon-2026.firebasestorage.app",
  messagingSenderId: "27956024483",
  appId: "1:27956024483:web:54a3deb5946501ff04db16"
};

// 1. O React liga para o Google e apresenta o mapa
const app = initializeApp(firebaseConfig);

// 2. Nós pegamos o "Cão de Guarda" (Autenticação) e exportamos
export const auth = getAuth(app);

// 3. NOVO: Nós pegamos o "Cofre de Dados" (Firestore) e exportamos
export const db = getFirestore(app);
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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

// 2. Nós pegamos o "Cão de Guarda" (Autenticação) e exportamos para usar no App.jsx
export const auth = getAuth(app);
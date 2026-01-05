
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCSoV1SsHB-0Ue-OcWXhh41lbek4URuHAg",
  authDomain: "anandpandeyindia.firebaseapp.com",
  databaseURL: "https://anandpandeyindia-default-rtdb.firebaseio.com",
  projectId: "anandpandeyindia",
  storageBucket: "anandpandeyindia.firebasestorage.app",
  messagingSenderId: "1080997825126",
  appId: "1:1080997825126:web:4e2508acd6b5ad17983ba7",
  measurementId: "G-86TZWEFCFL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

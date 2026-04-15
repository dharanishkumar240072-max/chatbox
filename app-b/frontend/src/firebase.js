import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6S6Lrr4KHvi9HM1iErW29ala2nNAC5Sg",
  authDomain: "chatbox-608bc.firebaseapp.com",
  projectId: "chatbox-608bc",
  storageBucket: "chatbox-608bc.firebasestorage.app",
  messagingSenderId: "494487372053",
  appId: "1:494487372053:web:9f9a0f5b89984589fba91c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

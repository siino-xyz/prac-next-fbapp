// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbZBJHzCvauK3wHr7B0y7Tdeb_2zPrpIY",
  authDomain: "dev-nextapp.firebaseapp.com",
  projectId: "dev-nextapp",
  storageBucket: "dev-nextapp.appspot.com",
  messagingSenderId: "321007591445",
  appId: "1:321007591445:web:acde302061f41bfb496e1c",
  measurementId: "G-759FZTPV74",
};

if (getApps()?.length) {
  initializeApp(firebaseConfig);
}

export const app = initializeApp(firebaseConfig);
export const storage = getStorage();
export const auth = getAuth();
export const functions = getFunctions();
export const db = getFirestore();

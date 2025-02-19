import { initializeApp } from "firebase/app"; 
import { getDatabase, ref, set, push, onValue, remove, update } from "firebase/database"; 
 
const firebaseConfig = {
    apiKey: "AIzaSyAasAGtN6KobhSOkXfEG6iVl1ZpdfesLYU",
    authDomain: "teste-firebase-5fc79.firebaseapp.com",
    databaseURL: "https://teste-firebase-5fc79-default-rtdb.firebaseio.com",
    projectId: "teste-firebase-5fc79",
    storageBucket: "teste-firebase-5fc79.firebasestorage.app",
    messagingSenderId: "915764684515",
    appId: "1:915764684515:web:0dc451818feadc9a7587d6",
    measurementId: "G-JKB9HGHHVW"
  };
  
const app = initializeApp(firebaseConfig); 
const db = getDatabase(app); 
 
export { db, ref, set, push, onValue, remove, update }; 
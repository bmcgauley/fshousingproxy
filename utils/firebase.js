import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtM53hA2vb__cKW1F_0ceYCufPwNAUUcY",
  authDomain: "fshousingdata.firebaseapp.com",
  projectId: "fshousingdata",
  storageBucket: "fshousingdata.firebasestorage.app",
  messagingSenderId: "452121646536",
  appId: "1:452121646536:web:ba49f0ab3cfdb759535cfd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
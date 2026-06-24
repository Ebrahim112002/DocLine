// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJMI1drbqjykWJXaBVnDLh6CzRM2ml5fQ",
  authDomain: "docline-b4c0a.firebaseapp.com",
  projectId: "docline-b4c0a",
  storageBucket: "docline-b4c0a.firebasestorage.app",
  messagingSenderId: "514641040396",
  appId: "1:514641040396:web:6bbc7d12836d45a96e4a29"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
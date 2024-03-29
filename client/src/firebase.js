// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "techblog-e1f07.firebaseapp.com",
  projectId: "techblog-e1f07",
  storageBucket: "techblog-e1f07.appspot.com",
  messagingSenderId: "782795368686",
  appId: "1:782795368686:web:a4ce643e428244e218abff"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
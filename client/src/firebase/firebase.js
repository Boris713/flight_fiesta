// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQsJH27-KXBih2fRTgNWqQC4ZZCPapzoY",
  authDomain: "flightfiesta-78afe.firebaseapp.com",
  projectId: "flightfiesta-78afe",
  storageBucket: "flightfiesta-78afe.appspot.com",
  messagingSenderId: "468962218389",
  appId: "1:468962218389:web:3d3075761037009af7e69c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };

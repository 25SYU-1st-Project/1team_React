// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbWuTCOc_gCwphF2fUAZERd_KQh5LlzOg",
  authDomain: "p-eeting.firebaseapp.com",
  projectId: "p-eeting",
  storageBucket: "p-eeting.firebasestorage.app",
  messagingSenderId: "239193857892",
  appId: "1:239193857892:web:6abc69da717fbd5f4e6471",
  measurementId: "G-42507EMC9K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
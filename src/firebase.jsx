// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase 설정 정보 (Firebase Console에서 복사)
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

export const auth = getAuth(app);
export const db = getFirestore(app);
export { app }; // Added export for app
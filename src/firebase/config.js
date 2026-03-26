
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVu1xvdsk1tmYS0t7vu6YADgEHjVQgQZA",
  authDomain: "smarttrolleydata-9c8da.firebaseapp.com",
  projectId: "smarttrolleydata-9c8da",
  storageBucket: "smarttrolleydata-9c8da.firebasestorage.app",
  messagingSenderId: "801413839545",
  appId: "1:801413839545:web:05e4f08235831e2c15b968",
  measurementId: "G-M9FZ5VKCPS",
};

// Initialize Firebase app instance
const app = initializeApp(firebaseConfig);

// Initialize Firestore database instance
export const db = getFirestore(app);

export default app;


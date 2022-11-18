// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0uknIp8TTA89WyMT2fvwDWkGh2PW-9Po",
  authDomain: "realtor-clone-19ed3.firebaseapp.com",
  projectId: "realtor-clone-19ed3",
  storageBucket: "realtor-clone-19ed3.appspot.com",
  messagingSenderId: "416197479306",
  appId: "1:416197479306:web:2d57c79d3bd055fe701673",
  measurementId: "G-3X3HTBRLGQ",
};

// Initialize Firebase
initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore();

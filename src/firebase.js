// 必要な関数を import
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_cjCJHmtzdkdYVFFepQV9NsR6m7yaUHw",
  authDomain: "book-sharing-app-48e15.firebaseapp.com",
  projectId: "book-sharing-app-48e15",
  storageBucket: "book-sharing-app-48e15.appspot.com",
  messagingSenderId: "1086488951862",
  appId: "1:1086488951862:web:ebf93901ccde1a5f996c97",
  measurementId: "G-2JPEEX9NTG",
};

// Firebaseアプリオブジェクトを初期化
const app = initializeApp(firebaseConfig);
// Firestoreを読み込み、db(databaseの略)として export
export const db = getFirestore(app);
// Firebase Authenticationを使用
export const auth = getAuth(app);

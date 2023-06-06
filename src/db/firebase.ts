import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "investr-metals.firebaseapp.com",
    projectId: "investr-metals",
    storageBucket: "investr-metals.appspot.com",
    messagingSenderId: "454804792386",
    appId: "1:454804792386:web:1f1296db5650f2cbaaf9db"
});

export const db = getFirestore(app);
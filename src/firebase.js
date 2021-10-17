import firebase from "firebase/app";
import "firebase/auth";

export const auth = firebase
  .initializeApp({
    apiKey: "AIzaSyBD-Rv4VUIc3BrD9c8PGDQAE_7laI5_kPs",
    authDomain: "better-messenger-c4b04.firebaseapp.com",
    projectId: "better-messenger-c4b04",
    storageBucket: "better-messenger-c4b04.appspot.com",
    messagingSenderId: "185276165760",
    appId: "1:185276165760:web:0b89259acc9bda75dd0065",
  })
  .auth();

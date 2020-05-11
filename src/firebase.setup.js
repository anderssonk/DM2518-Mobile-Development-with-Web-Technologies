import "firebase/auth";
import "firebase/firestore";
import * as firebase from "firebase/app";
import firebaseConfig from "./firebase.config";


firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebase.auth();
const db = firebase.firestore(); 

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

export { providers, firebaseAppAuth, db};

import "firebase/auth";
import * as firebase from "firebase/app";
import firebaseConfig from "./firebase.config";

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

export { providers, firebaseAppAuth };

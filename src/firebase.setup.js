// This file is responsible for Firebase services.
// Use this file to import additional services.

import "firebase/auth";
import * as firebase from "firebase/app";
import firebaseConfig from "./firebase.config";

const firebaseApp = firebase.initializeApp(firebaseConfig); // The returned object when initialising.
const firebaseAppAuth = firebaseApp.auth(); // Returned object when initialising authentication service

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

export { providers, firebaseAppAuth };

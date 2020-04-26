import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyBNheVkVa8zgevs7T4hcCWUfTFFDoXQoPE",
  authDomain: "inwinetation.firebaseapp.com",
  databaseURL: "https://inwinetation.firebaseio.com",
  projectId: "inwinetation",
  storageBucket: "inwinetation.appspot.com",
  messagingSenderId: "339591464469",
  appId: "1:339591464469:web:d8e340e5933004a0d3301c",
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();

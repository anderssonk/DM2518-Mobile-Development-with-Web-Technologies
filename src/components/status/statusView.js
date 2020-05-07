import React from "react";
import { Page } from "react-onsenui"; // Only import the necessary components
// import * as Ons from 'react-onsenui'; // Import everything and use it as 'Ons.Page', 'Ons.Button'

import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

function StatusView({logout, user, firebaseSetup}) {

  let data = {
    //name: 'Hildur',
    //mail: 'potatis@mail.com',
    name: user.displayName,
    mail: user.email,
    location: null
  };

  function toDB(){
    //firebaseSetup.db.collection('users').doc('user').set(data);
    firebaseSetup.db.collection('users').doc(user.uid).set(data);
  }

  //let userRef = firebaseSetup.db.collection('users').doc('user');
  let userRef = firebaseSetup.db.collection('users').doc(user.uid);
  // eller köra users/user/ med data om namn och även uid
  function getDoc(){
  userRef.get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        console.log('Document data:', doc.data());
        // console.log("user", user)
        // return doc.data().name;
        return doc.data();
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
  })};

  // ------------
  let userNamesRef = firebaseSetup.db.collection('users');

  //använda detta för att söka på vänner via input
  function queryRef(){
    userNamesRef.where('name', '==', 'Hilda Robertsson').get()   
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      }  

      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
  }


  return (
  <Page>
    Status page
    <button onClick={() => toDB() + console.log("adding data")}>Add data</button>
    <button onClick={() => getDoc() + console.log("getting data")}>Get data</button>
    <button onClick={() => queryRef() + console.log("getting query")}>Get query</button>
    <button onClick={logout}>Logout</button>
  </Page>);
}

export default StatusView;

import React from "react";
import { Page, List } from "react-onsenui"; // Only import the necessary components
// import * as Ons from 'react-onsenui'; // Import everything and use it as 'Ons.Page', 'Ons.Button'

import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

function FriendsView({ user, firebaseSetup }) {

  // let userNamesRef = firebaseSetup.db.collection('users');

  // function queryRef(){
  //   userNamesRef.where('name', '==', 'Hilda Robertsson').get()   
  //   .then(snapshot => {
  //     if (snapshot.empty) {
  //       console.log('No matching documents.');
  //       return;
  //     }  

  //     snapshot.forEach(doc => {
  //       console.log(doc.id, '=>', doc.data());
  //     });
  //   })
  //   .catch(err => {
  //     console.log('Error getting documents', err);
  //   });
  // }

  return (
    <Page>
      <div>Logged in as {user.displayName}</div>
      {/* <button onClick={() => queryRef()}>Get friends</button> */}
      <List>
        <ons-list-item tappable>Albin</ons-list-item>
        <ons-list-item tappable>Kristina</ons-list-item>
        <ons-list-item tappable>Billy</ons-list-item>
        <ons-list-item tappable>Hilda</ons-list-item>
        <ons-list-item tappable>Anna</ons-list-item>
      </List>
    </Page>
  );
}

export default FriendsView;

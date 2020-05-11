import React from "react";
import { Page, List } from "react-onsenui"; // Only import the necessary components
// import * as Ons from 'react-onsenui'; // Import everything and use it as 'Ons.Page', 'Ons.Button'

import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

function FriendsView({ user, firebaseSetup }) {

  let userRef = firebaseSetup.db.collection('users').doc(user.uid);

  // search for users
  let friendValue = '';
  const getSearch = e => {
    e.preventDefault();
    friendValue = document.getElementById("input_id").value;
    queryRef(friendValue)
  }

  // if friends exist and then option to add to friendlist 
  let friendlist = []; 
  let userNamesRef = firebaseSetup.db.collection('users');
  function queryRef(person){
    userNamesRef.where('name', '==', person).get()   
    .then(snapshot => {
      if (snapshot.empty) {
        window.alert("Your friend cannot be found...");
        console.log('Your friend does not exist...');
        return;
      }  
      snapshot.forEach(doc => {
        if (window.confirm("Do you want to add this person to your friendlist?")) {
         //vilken info om friend ska vara lagrad? uid, name, mail? 
          // console.log("You pressed OK!");
          let friend = doc.data().name
          friendlist.push(friend);
          // setMyFriendList(friend)
          // uppdatera i firestore 
          userRef.set({
            friendList: friendlist
          }, {merge: true});
          // setMyFriendList(friend)

        } else {
          // console.log("You pressed Cancel!");
        }
        // console.log("Your friend exist!", doc.id, '=>', doc.data());
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
  }

  // -------------------------------------------------------------------------------------------------------------------------------------
  // get info from firestore

  let myList = [];
  const [myFriendList, setMyFriendList] = React.useState([]);

  // kolla så att _friendlist_ existerar 
  function getFriendList(){userRef.get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        if (doc.data().friendList){
          doc.data().friendList.map(item => myList.push(item));
          // setMyFriendList(doc.data().friendList) // GÖR EJ DETTA!!! detta gör att det rendrar hur mycket som helst 
          // setMyFriendList(myList) // GÖR EJ SÅHÄR HELLER 
        // return doc.data().friendList;
        // console.log("list:", myFriendList)
        console.log(" my friend list ", myFriendList)
        console.log("my list: ", myList)
        console.log("true")
         return true; 
        //  return doc.data().friendList;
      }
        else {console.log("No friendlist")}
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
  });}

  return (
    <Page>
      <div>Logged in as {user.displayName}</div>
      <div>
        <h1>Friendlist</h1>
        {/* want to display for every item in the list  */}
        {/* <button onClick={console.log("my list: ", myFriendList)}>Get my list</button> */}
        {/* {getFriendList()} */}
        {/* {console.log("my friend list ", myFriendList)} */}
        {/* {getFriendList() ? console.log("my list: ", myList) : console.log("No list", myList) && myList.map(item => <li>{item}</li>)} */}
      </div>

      {/* form to search for friends and optionally add to friendlist */}
      <form onSubmit={e=>getSearch(e)}>
                <input id="input_id" type="text"/>
                <button type="submit" className="searchButton">Search</button>
      </form>
  

      <List>
        {/* <ons-list-item>{getFriendList() ? console.log("list", myList) : console.log("list two", myList)}</ons-list-item> */}

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

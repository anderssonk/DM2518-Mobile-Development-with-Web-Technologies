import React, { useState, useEffect } from "react";
import { Page, List } from "react-onsenui"; // Only import the necessary components
// import * as Ons from 'react-onsenui'; // Import everything and use it as 'Ons.Page', 'Ons.Button'

import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";
import Friends from "./friends";

function FriendsTest({ friends, user, firebaseSetup, getSearch }) {
  const [error, setError] = useState();

  return (
      <Page>
      <ons-search-input id="input_id" type="text" placeholder="Search for a friend!"/>
        <ons-button onClick={(e) => getSearch(e)}>
          Search
        </ons-button>
        <List>
        <ons-list-header>My Friends</ons-list-header>
        {friends.map((i) => (
          <ons-list-item tappable>{i}</ons-list-item>
        ))}
        </List>
      </Page>
  );
}

export default FriendsTest;

// function getFriendList() {
//   userRef
//     .get()
//     .then((doc) => {
//       if (!doc.exists) {
//         console.log("No such document!");
//       }
//       if (doc.data().friendList) {
//         doc.data().friendList.map((item) => friendList.push(item));
//         console.log("friendList", friendList);
//         //friendList = Object.values(friendList);
//         friendList.map((i) => console.log("map", i));
//         returnValue = friendList.map((i) => <div>{i}</div>);
//         console.log("returnValue i funkt", returnValue);
//         //setFriends(friendList);
//         return;
//       }
//       setFriends(friendList);
//     })
//     .catch((err) => {
//       console.log("Error getting document", err);
//     });
// }

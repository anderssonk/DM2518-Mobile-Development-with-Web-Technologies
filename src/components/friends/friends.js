import React, { useEffect, useState } from "react";
import { Page } from "react-onsenui"; // Only import the necessary components
// import * as Ons from 'react-onsenui'; // Import everything and use it as 'Ons.Page', 'Ons.Button'
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";
import FriendsView from "../friends/friendsView";


const firebase = require('firebase');

function Friends({ user, firebaseSetup, logout }) {
  const [friends, setFriends] = useState([]);
  let friendList = [];
  let userRef = firebaseSetup.db.collection("users").doc(user.uid);

  useEffect(() => {
    userRef.get().then((response) => {
      response.data().friendList.map(item => {
        friendList = [...friendList, item];
      });

      setFriends(friendList);
    });
  }, [friendList]);

  let friendValue = "";
  const getSearch = (e) => {
    e.preventDefault();
    friendValue = document.getElementById("input_id").value;
    queryRef(friendValue);
  };

  let userNamesRef = firebaseSetup.db.collection("users");
  function queryRef(person) {
    userNamesRef
      .where("name", "==", person)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          window.alert("Your friend cannot be found...");
          return;
        }
        snapshot.forEach((doc) => {
          if (
            window.confirm("Do you want to add this person to your friendlist?")
          ) {
            let newFriend = doc.data().name;

            userRef.update({
                friendList: firebase.firestore.FieldValue.arrayUnion(
                    newFriend
                )
            })
          }
        });
      })
      .catch((err) => {
        console.log("Error getting documents", err);
      });
  }

  return (
    <Page>
      <FriendsView
        friends={friends}
        user={user}
        firebaseSetup={firebaseSetup}
        getSearch={getSearch}
        logout={logout}
      />
    </Page>
  );
}

export default Friends;

import React from "react";
import { Page, List, Button, Tabbar, Tab } from "react-onsenui"; // Only import the necessary components
// import * as Ons from 'react-onsenui'; // Import everything and use it as 'Ons.Page', 'Ons.Button'

import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";
import FriendsView from "../friends/friendsView";

function Friends({ user, firebaseSetup }) {

  return (
    <Page>
      <FriendsView user={user} firebaseSetup={firebaseSetup} />
    </Page>
  );
}

export default Friends;

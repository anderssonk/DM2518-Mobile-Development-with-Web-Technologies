import React from "react";
import { Page, List } from "react-onsenui"; // Only import the necessary components
// import * as Ons from 'react-onsenui'; // Import everything and use it as 'Ons.Page', 'Ons.Button'

import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

function FriendsView({ user }) {
  return (
    <Page>
      <div>Logged in as {user.displayName}</div>
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

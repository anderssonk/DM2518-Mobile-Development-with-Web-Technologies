import React from "react";
import { Page, Button, Tabbar, Tab } from "react-onsenui"; // Only import the necessary components
// import * as Ons from 'react-onsenui'; // Import everything and use it as 'Ons.Page', 'Ons.Button'

import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

function MapView({ user }) {
  return (
    <Page>
      <div>Logged in as {user.displayName}</div>
      <div>MapView</div>
    </Page>
  );
}

export default MapView;

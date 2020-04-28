import React from "react";
import { Page, Button, Tabbar, Tab } from "react-onsenui"; // Only import the necessary components
// import * as Ons from 'react-onsenui'; // Import everything and use it as 'Ons.Page', 'Ons.Button'

import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";
import StatusView from "../status/statusView";

function Status({ user }) {
  return (
    <Page>
      <StatusView user={user} />
    </Page>
  );
}

export default Status;

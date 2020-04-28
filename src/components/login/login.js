import React, { useState } from "react";
import { Page, Input } from "react-onsenui"; // Only import the necessary components
// import * as Ons from 'react-onsenui'; // Import everything and use it as 'Ons.Page', 'Ons.Button'

import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

function Login({ login }) {
  return (
    <Page>
      <div>You have to log in to use this application</div>
      <button onClick={login}>Login</button>
    </Page>
  );
}

export default Login;

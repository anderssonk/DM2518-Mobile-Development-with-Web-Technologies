import React, { useState } from "react";
import { Page, Input } from "react-onsenui"; // Only import the necessary components
// import * as Ons from 'react-onsenui'; // Import everything and use it as 'Ons.Page', 'Ons.Button'

import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";
import LoginView from "../login/loginView";

function Login({ login }) {
  return (
    <Page>
      <div>You have to be logged in to use this application</div>
      <div>
        <button onClick={login}>Login</button>
      </div>
    </Page>
  );
}

export default Login;

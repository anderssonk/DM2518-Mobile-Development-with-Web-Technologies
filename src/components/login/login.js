import React, { useState, setState } from "react";
import { Page, Input } from "react-onsenui"; // Only import the necessary components
// import * as Ons from 'react-onsenui'; // Import everything and use it as 'Ons.Page', 'Ons.Button'

import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <Page>
      <div> Login or create account</div>

      <Input
        value={username}
        float
        // onChange={(event) => {
        //   setState({ text: event.target.value });
        // }}
        modifier="material"
        placeholder="username"
      />
      <Input
        value={password}
        float
        // onChange={(event) => {
        //   setState({ text: event.target.value });
        // }}
        modifier="material"
        placeholder="password"
      />
    </Page>
  );
}

export default Login;

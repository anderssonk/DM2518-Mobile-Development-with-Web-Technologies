import React from "react";
import { Page } from "react-onsenui"; // Only import the necessary components
// import * as Ons from 'react-onsenui'; // Import everything and use it as 'Ons.Page', 'Ons.Button'

import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

function StatusView({ logout, user, firebaseSetup }) {
  let userRef = firebaseSetup.db.collection("users").doc(user.uid);

  let setUserData = userRef.set(
    {
      name: user.displayName,
      mail: user.email,
      // friendList: [],
      // antagligen inte ha med location här heller
      // location: null
    },
    { merge: true }
  );

  // let data = {
  //   location: 'mylocation',
  // };

  // let setLocation = firebaseSetup.db.collection('users').doc(user.uid).set(data);

  return (
    <Page>
      Status page
      <button onClick={logout}>Logout</button>
    </Page>
  );
}

export default StatusView;

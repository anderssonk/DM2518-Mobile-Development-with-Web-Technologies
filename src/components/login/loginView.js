import React from "react";
import { Page } from "react-onsenui"; // Only import the necessary components
// import * as Ons from 'react-onsenui'; // Import everything and use it as 'Ons.Page', 'Ons.Button'

import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

function LoginView({login, user, firebaseSetup}) {
  //   let data = {
  //   //name: user.displayName,
  //   name: 'hildur',
  //   // mail: user.email,
  //   // location: null
  // };

  // function toDB(){
  //   // firebaseSetup.db.collection('users').doc(user.uid).set(data);
  //   firebaseSetup.db.collection('users').doc('user').set(data);
  // };
  
  return (
    <Page>
     <div>You have to be logged in to use this application</div>
      <div>
        <button onClick={login}>Login</button>
        {/* <div>{toDB()}</div> */}
      </div>

    </Page>);
}

export default LoginView;

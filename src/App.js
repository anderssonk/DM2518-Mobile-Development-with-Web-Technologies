import React, { useState } from "react";
import { Page, Button, Tabbar, Tab } from "react-onsenui"; // Only import the necessary components
// import * as Ons from 'react-onsenui'; // Import everything and use it as 'Ons.Page', 'Ons.Button'
import "./App.css";
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

import withFirebaseAuth from "react-with-firebase-auth";
import * as firebaseSetup from "./firebase.setup";

import Friends from "../src/components/friends/friends";
import Status from "../src/components/status/status";
import Map from "./components/map/map";
import GMap from "./components/map/googlemaps2";
import Login from "../src/components/login/login";

function App({ signInWithGoogle, signOut, user }) {
  const [index, setIndex] = useState(0);
  const [logedIn, setLogedin] = useState(true);

  return (
    <div className="App">
      <Page>
        {user ? (
          <Tabbar
            position="bottom"
            index={index}
            renderTabs={(activeIndex, tabbar) => [
              {
                content: (
                  <Page title="Map" active={activeIndex === 0} tabbar={tabbar}>
                    <GMap />
                  </Page>
                ),
                tab: <Tab label="Map" icon="md-map" />,
              },
              {
                content: (
                  <Status
                    title="Status"
                    active={activeIndex === 1}
                    tabbar={tabbar}
                  />
                ),
                tab: <Tab label="Status" icon="md-local-bar" />,
              },
              {
                content: (
                  <Friends
                    title="Friends"
                    active={activeIndex === 0}
                    tabbar={tabbar}
                    user={user}
                  />
                ),
                tab: <Tab label="Friends" icon="md-flare" />,
              },
            ]}
          />
        ) : (
          <Login login={signInWithGoogle} />
        )}
      </Page>
    </div>
  );
}

//export default App;

export default withFirebaseAuth({
  providers: firebaseSetup.providers,
  firebaseAppAuth: firebaseSetup.firebaseAppAuth,
})(App);

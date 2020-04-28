import React, { useState, useContext } from "react";
import { Page, Tabbar, Tab } from "react-onsenui"; // Only import the necessary components
// import * as Ons from 'react-onsenui'; // Import everything and use it as 'Ons.Page', 'Ons.Button'
import "./App.css";
// ONSEN
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

// COMPONENTS
import Friends from "../src/components/friends/friends";
import Status from "../src/components/status/status";
import Map from "../src/components/map/map";
import Login from "../src/components/login/login";

// FIREBASE
import * as firebaseSetup from "./firebase.setup";
import withFirebaseAuth from "react-with-firebase-auth";

// Props from withFirebaseAuth HOC
function App({ signInWithGoogle, signOut, user }) {
  const [index, setIndex] = useState(0);
  let renderContent = null;

  !user
    ? (renderContent = (
        <Page>
          <Login login={signInWithGoogle} />
          <Login />
        </Page>
      ))
    : (renderContent = (
        <div>
          <Page>
            <Tabbar
              position="bottom"
              index={index}
              renderTabs={(activeIndex, tabbar) => [
                {
                  content: (
                    <Map
                      title="Map"
                      user={user}
                      active={activeIndex === 0}
                      tabbar={tabbar}
                    />
                  ),
                  tab: <Tab label="Map" icon="md-map" />,
                },
                {
                  content: (
                    <Status
                      title="Status"
                      user={user}
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
                      user={user}
                      active={activeIndex === 0}
                      tabbar={tabbar}
                    />
                  ),
                  tab: <Tab label="Friends" icon="md-flare" />,
                },
              ]}
            />
          </Page>
        </div>
      ));

  return <div className="App">{renderContent}</div>;
}

export default withFirebaseAuth({
  providers: firebaseSetup.providers,
  firebaseAppAuth: firebaseSetup.firebaseAppAuth,
})(App);
//export default App;

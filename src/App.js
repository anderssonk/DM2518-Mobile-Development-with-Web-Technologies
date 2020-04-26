import React, { useState } from "react";
import { Page, Button, Tabbar, Tab } from "react-onsenui"; // Only import the necessary components
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

function App() {
  const [index, setIndex] = useState(0);
  const [logedIn, setLogedin] = useState(true);

  return (
    <div className="App">
      <Page>
        {logedIn ? (
          <Tabbar
            position="bottom"
            index={index}
            renderTabs={(activeIndex, tabbar) => [
              {
                content: (
                  <Map title="Map" active={activeIndex === 0} tabbar={tabbar} />
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
                  />
                ),
                tab: <Tab label="Friends" icon="md-flare" />,
              },
            ]}
          />
        ) : (
          <Login />
        )}
      </Page>
    </div>
  );
}

export default App;

import React from "react";
import { Page, Button, Tabbar, Tab } from "react-onsenui"; // Only import the necessary components
// import * as Ons from 'react-onsenui'; // Import everything and use it as 'Ons.Page', 'Ons.Button'
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";
import GoogleMaps from "./googlemaps";

function MapView() {
	return (
		<Page>
			<GoogleMaps />
		</Page>
	);
}

export default MapView;

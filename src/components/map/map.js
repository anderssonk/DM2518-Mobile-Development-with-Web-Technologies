import React from "react";
import { Page } from "react-onsenui";
import GoogleMaps from "./googlemaps";

function Map({user, firebaseSetup}) {
	return (
		<Page>
			<GoogleMaps user={user} firebaseSetup={firebaseSetup}/>
		</Page>
	);
}

export default Map;

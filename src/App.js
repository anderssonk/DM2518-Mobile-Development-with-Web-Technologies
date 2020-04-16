import React from "react";
import { Page, Button } from "react-onsenui"; // Only import the necessary components
// import * as Ons from 'react-onsenui'; // Import everything and use it as 'Ons.Page', 'Ons.Button'
import "./App.css";
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

const handleClick = () => {
	alert("Henlo World!");
};

function App() {
	return (
		<div className="App">
			<Page>
				<Button onClick={handleClick}>Tap me!</Button>
			</Page>
		</div>
	);
}

export default App;

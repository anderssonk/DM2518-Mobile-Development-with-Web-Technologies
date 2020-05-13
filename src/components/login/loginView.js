import React from "react";
import { Page } from "react-onsenui"; // Only import the necessary components
// import * as Ons from 'react-onsenui'; // Import everything and use it as 'Ons.Page', 'Ons.Button'
import logo from "../../icon.svg";

import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

function LoginView({ login, user, firebaseSetup }) {
	return (
		<Page>
			<div className="login-page">
				<div className="login-page__section">
					<img src={logo} alt="logo" className="login-img"></img>
				</div>
				<div className="login-page__section">
					<button onClick={login} className="btn login-btn">
						Login
					</button>
					<div className="subtle">You must be logged in to use this app</div>
				</div>
			</div>
		</Page>
	);
}

export default LoginView;

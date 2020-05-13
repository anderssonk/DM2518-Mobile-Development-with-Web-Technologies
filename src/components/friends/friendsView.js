import React, { useState, useEffect } from "react";
import { Page, List } from "react-onsenui"; // Only import the necessary components
// import * as Ons from 'react-onsenui'; // Import everything and use it as 'Ons.Page', 'Ons.Button'

import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";
import Friends from "./friends";

function FriendsTest({ friends, user, firebaseSetup, getSearch, logout }) {
	const [error, setError] = useState();

	return (
		<Page>
			<div className="logged-in-as">
				Logged in as {user.displayName}
				<button onClick={logout} className="btn logout-btn">
					<i class="zmdi zmdi-square-right"></i>
				</button>
			</div>
			<div>
				<h1>Friendlist</h1>
			</div>

			{/* form to search for friends and optionally add to friendlist */}
			<form onSubmit={(e) => getSearch(e)}>
				<ons-search-input className="input-field" id="input_id" type="text" />
				<button
					type="submit"
					className="btn search-btn"
					onClick={(e) => getSearch(e)}
				>
					<i class="zmdi zmdi-account-add"></i>
				</button>
			</form>
			<List>
				{friends.map((i) => (
					<ons-list-item tappable>{i}</ons-list-item>
				))}
			</List>
		</Page>
	);
}

export default FriendsTest;

// function getFriendList() {
//   userRef
//     .get()
//     .then((doc) => {
//       if (!doc.exists) {
//         console.log("No such document!");
//       }
//       if (doc.data().friendList) {
//         doc.data().friendList.map((item) => friendList.push(item));
//         console.log("friendList", friendList);
//         //friendList = Object.values(friendList);
//         friendList.map((i) => console.log("map", i));
//         returnValue = friendList.map((i) => <div>{i}</div>);
//         console.log("returnValue i funkt", returnValue);
//         //setFriends(friendList);
//         return;
//       }
//       setFriends(friendList);
//     })
//     .catch((err) => {
//       console.log("Error getting document", err);
//     });
// }

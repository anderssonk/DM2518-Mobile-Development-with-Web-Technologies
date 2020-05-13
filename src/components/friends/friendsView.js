import React, { useState, useEffect } from "react";
import { Page, List } from "react-onsenui"; // Only import the necessary components
// import * as Ons from 'react-onsenui'; // Import everything and use it as 'Ons.Page', 'Ons.Button'

import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

function FriendsTest({ friends, user, firebaseSetup, getSearch, logout }) {

  return (
      <Page>
      <div className="logged-in-as">
				Logged in as {user.displayName}
				<button onClick={logout} className="btn logout-btn">
					<i class="zmdi zmdi-square-right"></i>
				</button>
			</div>
			{/* form to search for friends and optionally add to friendlist */}
			<form onSubmit={(e) => getSearch(e)}>
				<input
					id="input_id"
					className="input-field"
					type="text"
					placeholder="Enter friend's name"
				/>
				<button type="submit" className="btn search-btn">
					<i class="zmdi zmdi-account-add"></i>
				</button>
			</form>
      
        <List>
        <ons-list-header>My Friends</ons-list-header>
        {friends.map((i) => (
          <ons-list-item tappable>{i}</ons-list-item>
        ))}
        </List>
      </Page>
  );
}

export default FriendsTest;

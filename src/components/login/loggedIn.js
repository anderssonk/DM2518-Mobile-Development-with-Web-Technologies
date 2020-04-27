import React from "react";
import { Page, Tabbar } from "react-onsenui"; // Only import the necessary components

const LoggedIn = ({ user }) => {
  return (
    <Page>
      <div>Logged in as {user.displayName}</div>
    </Page>
  );
};

export default LoggedIn;

import React, { Component, Fragment } from "react";
import { GoogleOAuthCallback } from "components/GoogleSignIn/GoogleOAuthCallback";

export default function () {
  const render = GoogleOAuthCallback();
  return <div>{render}</div>;
}

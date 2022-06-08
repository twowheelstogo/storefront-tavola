import React, { useEffect } from "react";
import { useGoogleLoginButton } from "./useGoogleLoginButton";
function GoogleSignIn() {
  const renderGoogleLoginButton = useGoogleLoginButton(() => {
    if (history && history.push) history.push("/");
  });
  return renderGoogleLoginButton();
}

export default GoogleSignIn;

import React, { useState, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import UtilizationService from "../services/auth/UtilizationService";
import { removeUserSession } from "../utils/AuthUtils";
import { getAllowedRoutes } from "../utils/PermissionUtils";
import { getLocalAccessToken, getUserInfo } from "../utils/TokenUtils";

function Unauthorized(rest) {
  if (getUserInfo()?.email)
    UtilizationService.utilizationMetrics("Unauthorized", {
      Action: "Login",
      userID: getUserInfo()?.email?.split("@")[0],
      Origin: "Login Unauthorized",
    });
  removeUserSession();
  return (
    <Route
      {...rest}
      render={({ location }) => (
        <Redirect
          to={{
            pathname: "/unauthorized",
            state: { from: location },
          }}
          replace
        />
      )}
    />
  );
}
const isAuthorized = (allowedRoutesArr, restInfo) => {
  return allowedRoutesArr.includes(restInfo.title.toLowerCase()) ||
    restInfo.title.toLowerCase().includes("dashboard") ||
    restInfo.title.toLowerCase().includes("insights") ? (
    <Route {...restInfo} />
  ) : (
    <Unauthorized {...restInfo} />
  );
};

function PrivateRoute({ component: _Component, ...rest }) {
  const [allowedRoutes, setAllowedRoutes] = useState(getAllowedRoutes());

  useEffect(() => {
    setAllowedRoutes(getAllowedRoutes());
  }, []);
  const token = getLocalAccessToken();
  const isLoggedIn = !!token;
  return !isLoggedIn ? (
    <Route
      {...rest}
      render={({ location }) => (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: location },
          }}
        />
      )}
    />
  ) : (
    isAuthorized(allowedRoutes, rest)
  );
}

export default PrivateRoute;

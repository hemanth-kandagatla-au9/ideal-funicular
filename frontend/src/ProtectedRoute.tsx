import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress } from "@mui/material";
import { useAgentPermissions } from "./utils/hooks/useAgentPermissions";
import { getMyPermissions, isMyPermissionsLoading } from "./redux/selectors/userAuthorization.selectors";
import userAuthorizationActions from "./redux/actions/userAuthorization.action";

interface ProtectedRouteProps {
  path: string;
  exact?: boolean;
  permission: string;
  component: React.ComponentType<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ permission, component: Component, ...rest }) => {
  const dispatch = useDispatch();
  const myPermissions = useSelector(getMyPermissions);
  const loading = useSelector(isMyPermissionsLoading);
  const { hasPermission } = useAgentPermissions();
  const [fetchTriggered, setFetchTriggered] = useState(false);

  useEffect(() => {
    if (!myPermissions && !loading) {
      dispatch(userAuthorizationActions.fetchMyPermissions());
    }
    setFetchTriggered(true);
  }, []);

  return (
    <Route
      {...rest}
      render={() => {
        if (!fetchTriggered || loading) {
          return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
              <CircularProgress sx={{ color: "#2961F4" }} />
            </Box>
          );
        }
        return hasPermission(permission) ? <Component /> : <Redirect to="/" />;
      }}
    />
  );
};

export default ProtectedRoute;

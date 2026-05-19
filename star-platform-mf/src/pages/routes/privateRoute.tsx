import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { hasPermission } from '../../utils/permissionUtil';

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  project: string;
  module: string;
  permissionLabel?: string;
  redirectTo?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  project,
  module,
  permissionLabel,
  redirectTo = '/app/unauthorized',
  ...rest
}) => {
  const { permissions, loaded } = useSelector((state: RootState) => state.permissions);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!loaded) return null;
        const redirectToUnauthorized = () => {
          const deniedPath = props.location.pathname;
          sessionStorage.setItem('deniedRoute', deniedPath);
          return (
            <Redirect
              to={{
                pathname: redirectTo,
                state: { deniedPath },
              }}
            />
          );
        };

        if (!permissionLabel) {
          return redirectToUnauthorized();
        }

        const allowed = hasPermission(permissions, project, module, permissionLabel);

        return allowed ? <Component {...props} /> : redirectToUnauthorized();
      }}
    />
  );
};

export default PrivateRoute;

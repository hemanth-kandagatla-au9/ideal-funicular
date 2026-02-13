import { Switch, Redirect, Route } from "react-router-dom";
import AppRoute from "./AppRoute";
import PrivateRoute from "./PrivateRoute";
import PageTitle from "../layouts/page-title/PageTitle";
import IdleTimeOutHandlerComponent from "../components/auth/IdleTimeoutHandlerComponent";
import config from "../config/config";
import { getUserInfo } from "../utils/TokenUtils";
import { getAllowedRoutes } from "../utils/PermissionUtils";
import { RedirectToUnauthorized, LoginWithRedirectURL } from "../utils/AuthUtils";
import Planning from "../layouts/operations/planning/Planning.layout";

const routes = [];
AppRoute.forEach((routeItem, _index) => {
  if (routeItem.component) {
    routes.push(
      <PrivateRoute
        key={routeItem.path}
        exact={routeItem.exact !== undefined ? routeItem.exact : true}
        path={routeItem.path}
        title={routeItem.pageTitle}
        render={props => (
          <PageTitle title={routeItem.pageTitle}>
            {" "}
            <routeItem.component {...routeItem.props} exact {...props} />{" "}
          </PageTitle>
        )}
      />,
    );
  }
  if (routeItem.children)
    for (const [subRouteIndex, subRoute] of routeItem.children.entries()) {
      if (subRoute.component) {
        const key = `subroute-${subRouteIndex}`;
        routes.push(
          <PrivateRoute
            key={key}
            exact={subRoute.exact !== undefined ? subRoute.exact : true}
            path={subRoute.link}
            title={subRoute.pageTitle}
            render={props => (
              <PageTitle title={subRoute.pageTitle}>
                {" "}
                <subRoute.component {...subRoute.props} {...props} />{" "}
              </PageTitle>
            )}
          />,
        );
      }
    }
});
function ProtectedLayoutRoute(props) {
  const { propsShowModal } = props;
  const userInfo = getUserInfo();
  const allowedRoutes = getAllowedRoutes();

  if (!userInfo || Object.keys(userInfo).length === 0) {
    return LoginWithRedirectURL(window.location.href);
  }
  if (allowedRoutes.length === 0) {
    return RedirectToUnauthorized();
  }
  return !userInfo || allowedRoutes.length === 0 ? (
    ""
  ) : (
    <div>
      <IdleTimeOutHandlerComponent
        propsShowModal={propsShowModal || false}
        timeOutInterval={config.LOGOUT_TIMEOUT}
        onActive={() => {
          return false;
        }}
        onIdle={() => {
          return false;
        }}
        onLogout={() => {
          return false;
        }}
      />
      <Planning>
        <Switch>
          {routes}
          <Route path="*">
            <Redirect to="/404" />
          </Route>
        </Switch>
      </Planning>
    </div>
  );
}

export default ProtectedLayoutRoute;

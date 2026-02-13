import { Router, Switch, Route } from "react-router-dom";
import NotFoundLayout from "../layouts/auth/NotFoundLayout";
import { history } from "../utils/utils";
import ProtectedLayoutRoute from "./ProtectedLayoutRoute";
import PublicLayoutRoute from "./PublicLayoutRoute";

export default function LayoutRoute() {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/404" component={NotFoundLayout} />
        <Route path="/app" component={ProtectedLayoutRoute} />
        <Route path="/" component={PublicLayoutRoute} />
      </Switch>
    </Router>
  );
}

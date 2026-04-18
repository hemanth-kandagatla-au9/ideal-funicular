import * as React from "react";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "font-awesome/css/font-awesome.min.css";
import "./App.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";

import AgentManagement from "./layouts/agent-management/AgentManagement";

import BinaryVersions from "./layouts/agent-management/components/versionmanagement/BinaryVersions";
import UserAuthorization from "./layouts/user-authorization/UserAuthorization";
import Permissions from "./layouts/user-authorization/Permissions";
import initializeStore from "./redux/initializeStore";

declare global {
  interface Window {
    __HOST_APP__?: boolean;
  }
}

// Create store once at module level — not inside the component so it
// survives re-renders without resetting state.
const store = initializeStore();
if (process.env.NODE_ENV === "development") {
  (window as any).__AGENT_STORE__ = store;
}

const App: React.FC = () => {
  const globalWindow = globalThis as unknown as Window;
  const isHostApp = Boolean(globalWindow.__HOST_APP__);
  const basepath = isHostApp ? "/app/riseagent" : "/";

  return (
    <div className="riseagent-mfe">
      <Provider store={store}>
        <BrowserRouter basename={basepath}>
          <ToastContainer />
          <Switch>
            <Route exact path="/" component={AgentManagement} />
            <Route path="/versionmanagement" component={BinaryVersions} />
            <Route path="/userAuthorization" component={UserAuthorization} />
            <Route path="/permissions" component={Permissions} />
          </Switch>
        </BrowserRouter>
      </Provider>
    </div>
  );
};

export default App;

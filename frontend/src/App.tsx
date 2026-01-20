import * as React from "react";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "font-awesome/css/font-awesome.min.css";
import "./App.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import AgentManagement from "./layouts/agent-management/AgentManagement";

import initializeStore from "./redux/initializeStore";
import BinaryVersions from "./layouts/agent-management/components/versionmanagement/BinaryVersions";
import UserAuthorization from "./layouts/user-authorization/UserAuthorization";
import Permissions from "./layouts/user-authorization/Permissions";

const store = initializeStore();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer />
        <Switch>
          <Route exact path="/" component={AgentManagement} />
          <Route path="/versionmanagement" component={BinaryVersions} />
          <Route path="/userAuthorization" component={UserAuthorization} />
          <Route path="/permissions" component={Permissions} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
};

export default App;

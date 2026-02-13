import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import {
  BrowserRouter,
  Route,
  MemoryRouter,
  useHistory,
} from "react-router-dom";

import Schedule from "../layouts/operations/planning/Planning.layout";
import AddSchedulePage from "../layouts/schedule/AddSchedulePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const DEFAULT_BASE_PATH = "/dashboard";

const ScheduleShell = ({ basePath }) => {
  // const history = useHistory();
  //   console.log("ScheduleShell history", history);

  // console.log("ScheduleShell pathname", window.location.pathname);
  // useEffect(() => {
  //     const { pathname, origin } = window.location;
  //     // console.log("origin : ",origin,pathname)

  //     if (pathname === "/app/schedule/dashboard") {
  //     history.push("/app/schedule");
  //     }
  //   }, []);

  return (
    <Provider store={store}>
      <ToastContainer
        className
        position="top-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <BrowserRouter basename={basePath}>
        <Route exact path="/" component={Schedule} />
        <Route path="/schedule/:id?" component={AddSchedulePage} />
      </BrowserRouter>
    </Provider>
  );
};

export default ScheduleShell;

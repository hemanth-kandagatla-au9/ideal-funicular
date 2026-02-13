import React from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { BrowserRouter } from "react-router-dom";

import Settings from "../components/configuration/Configs.layouts";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// "./Report": "./src/layouts/report/Report.layout.js",

const SettingsShell = (props) => {
  console.log("REPORT LOADED");
  console.log("REMOTE location:", window.location.pathname);

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
      <BrowserRouter basename="/app">
        <Settings {...props} />
      </BrowserRouter>
    </Provider>
  );
};

export default SettingsShell;

import React from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";

import SapFacts from "../components/configuration/HostDetailsList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SapFactsShell = (props) => {
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
      <SapFacts {...props} />
    </Provider>
  );
};

export default SapFactsShell;

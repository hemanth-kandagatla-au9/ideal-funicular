import React from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";

import Codemarketplace from "../layouts/Marketplace/AppStore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CodemarketplaceShell = (props) => {
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
      <Codemarketplace {...props} />
    </Provider>
  );
};

export default CodemarketplaceShell;

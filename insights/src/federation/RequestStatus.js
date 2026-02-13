import React from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";

import RequestStatus from "../layouts/Approval/ApprovalStatus";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RequestStatusShell = (props) => {
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
      <RequestStatus {...props} />
    </Provider>
  );
};

export default RequestStatusShell;

import React from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";

import RequestApproval from "../layouts/Approval/ApprovalsPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RequestApprovalShell = (props) => {
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
      <RequestApproval {...props} />
    </Provider>
  );
};

export default RequestApprovalShell;

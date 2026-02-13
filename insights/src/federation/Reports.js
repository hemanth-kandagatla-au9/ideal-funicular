// import React from "react";
// import { Provider } from "react-redux";
// import { store } from "../store/store";
// import { BrowserRouter ,Route } from "react-router-dom";
// import ReportDetails from "../layouts/report/ReportDetails"

// import Reports from "../layouts/report/Report.layout";
// // "./Report": "./src/layouts/report/Report.layout.js",

// const ReportsShell = (props) => {
//   console.log("REPORT LOADED");
//   console.log("REMOTE location:", window.location.pathname);

//   return (
//     <Provider store={store}>
//       <BrowserRouter basename="/app">

//         <Route exact path="/" component={Reports} />
//         <Route path="/schedule/:id?" component={ReportDetails} />
//         {/* <Reports {...props} /> */}
//         {/* <Route exact path */}
//       </BrowserRouter>
//     </Provider>
//   );
// };

// export default ReportsShell;

import React from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Reports from "../layouts/report/Report.layout";
import ReportDetails from "../layouts/report/ReportDetails";
import GlobalReports from "../layouts/report/GlobalReports";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReportsShell = () => {
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
        <Switch>
          <Route path="/reports/my-reports/:id">
            <ReportDetails />
          </Route>
          <Route path="/reports/global-reports/:id">
            <ReportDetails />
          </Route>
          <Route path="/report">
            <Reports />
          </Route>
        </Switch>
      </BrowserRouter>
    </Provider>
  );
};

export default ReportsShell;

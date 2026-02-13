import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-daterangepicker/daterangepicker.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { MsalProvider } from "@azure/msal-react";
import PageLayout from "./PageLayout";

function App({ instance }) {
  return (
    <MsalProvider instance={instance}>
      <BrowserRouter>
        <PageLayout />
      </BrowserRouter>
    </MsalProvider>
  );
}

export default App;

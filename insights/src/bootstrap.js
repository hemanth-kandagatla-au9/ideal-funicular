import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { store } from "./store/store";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { msalConfig } from "./utils/msalAuthConfig";

const msalInstance = new PublicClientApplication(msalConfig);
const isHostedMF = !!window.__POWERED_BY_IASPHERE__;
// Async function to initialize MSAL before using it
async function initializeMsal() {
  await msalInstance.initialize();

  if (
    !msalInstance.getActiveAccount() &&
    msalInstance.getAllAccounts().length > 0
  ) {
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
  }

  msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
      console.log("Login successful:", event.payload.account);
      msalInstance.setActiveAccount(event.payload.account);
    }
  });

  renderApp();
}

// Function to render the app after MSAL is initialized
function renderApp() {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App instance={msalInstance} />
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );
}

// Call MSAL initialization before rendering the app
initializeMsal();

reportWebVitals();

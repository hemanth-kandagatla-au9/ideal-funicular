import * as React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Provider } from "react-redux";
import App from "./App";
import initializeStore from "./redux/initializeStore";
import reportWebVitals from "./reportWebVitals";
 
const store = initializeStore();
 
 
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root"),
);

reportWebVitals();
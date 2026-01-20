/**
 * Dependencies.
 */
import { createStore, applyMiddleware, compose, Store } from "redux";
import createSagaMiddleware, { SagaMiddleware } from "redux-saga";
import { compact } from "lodash";
import { createLogger } from "redux-logger";
import rootReducer from "./reducers";
import sagas from "./sagas";
import INITIAL_STATE from "./initialState";

// Extend Window interface to include Redux DevTools extension
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

/**
 * Function for creating store with middlewares.
 */
export default function initializeStore(): Store {
  const sagaMiddleware: SagaMiddleware<object> = createSagaMiddleware();
  const middlewares = compact([sagaMiddleware, process.env.NODE_ENV === "development" ? createLogger() : null]);

  let composeEnhancers: typeof compose = compose;

  // IF NEED TO DEBUG REDUX VIA REMOTE DEVTOOLS
  if (process.env.NODE_ENV === "development") {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  }

  const store: Store = createStore(
    rootReducer,
    {
      app: INITIAL_STATE.app,
    },
    composeEnhancers(applyMiddleware(...middlewares)),
  );

  sagaMiddleware.run(sagas);
  return store;
}
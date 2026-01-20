/**
 * Importing dependencies.
 */
import { combineReducers } from "redux";
import appReducer from "./appReducer";
import agentManagementReducer from "./agentManagementReducer";
import userAuthorizationReducer from "./userAuthorizationReducer";

// combining all reducers to rootReducer
const rootReducer = combineReducers({
  app: appReducer,
  agentMangement: agentManagementReducer,
  userAuthorization: userAuthorizationReducer,
});

// exporting rootReducer function
export default rootReducer;

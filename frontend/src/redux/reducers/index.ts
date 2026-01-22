import { combineReducers } from "redux";
import appReducer from "./appReducer";
import agentManagementReducer from "./agentManagementReducer";
import userAuthorizationReducer from "./userAuthorizationReducer";
const rootReducer = combineReducers({
  app: appReducer,
  agentMangement: agentManagementReducer,
  userAuthorization: userAuthorizationReducer,
});
export default rootReducer;


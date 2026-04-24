import { combineReducers } from "redux";
import appReducer from "./appReducer";
import agentManagementReducer from "./agentManagementReducer";
import userAuthorizationReducer from "./userAuthorizationReducer";
import bulkActionLogsReducer from "./bulkActionLogsReducer";

const rootReducer = combineReducers({
  app: appReducer,
  agentMangement: agentManagementReducer,
  userAuthorization: userAuthorizationReducer,
  bulkActionLogs: bulkActionLogsReducer,
});
export default rootReducer;

import { UPDATE_APP_READY } from "../../config/actions";
import INITIAL_STATE from "../initialState";
interface AppState {
  appReady: boolean;
}
interface Action {
  type: string;
  payload?: {
    appReady?: boolean;
  };
}

export default function appReducer(state: AppState = INITIAL_STATE.app, action: Action = { type: "" }): AppState {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_APP_READY: {
      return {
        ...state,
        appReady: payload?.appReady ?? state.appReady,
      };
    }

    default:
      return state;
  }
}


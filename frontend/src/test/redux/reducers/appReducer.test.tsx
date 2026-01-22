import { UPDATE_APP_READY } from "../../../config/actions";
import appReducer from '../../../redux/reducers/appReducer';
import INITIAL_STATE from "../../../redux/initialState";
import '@testing-library/jest-dom/extend-expect';

describe('appReducer tests', () => {
  let initialState = undefined;
  const state = INITIAL_STATE.app;
  let action = { type: "", payload: '' };

  it("renders", () => {
    initialState = undefined;
    action = {};
    const res = appReducer(state, action);
    expect(res.appReady).toBe(false);
  });

  it("handles UPDATE_APP_READY action", () => {
    initialState = INITIAL_STATE.app;
    const payload = { appReady: true };
    action = { type: UPDATE_APP_READY, payload };
    const res = appReducer(initialState, action);
    expect(res.appReady).toBe(true);
  });
});





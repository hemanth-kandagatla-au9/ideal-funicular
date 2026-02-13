import { INSIGHT_SERVICE_MANAGEMENT } from "../../config/actions";

const requestGetConfigSettings = () => ({
    type: INSIGHT_SERVICE_MANAGEMENT.REQUEST_FETCH_CONFIG_SETTINGS,
  });
  const successGetConfigSettings = data => ({
    type: INSIGHT_SERVICE_MANAGEMENT.SUCCESS_FETCH_CONFIG_SETTINGS,
    payload: data,
  });
  const failureGetConfigSettings = (error = "") => ({
    type: INSIGHT_SERVICE_MANAGEMENT.FAILURE_FETCH_CONFIG_SETTINGS,
    error: error.message,
  });

  const insightConfigServiceMngt={
    requestGetConfigSettings,
    successGetConfigSettings,
    failureGetConfigSettings
  }


  export default insightConfigServiceMngt;

  
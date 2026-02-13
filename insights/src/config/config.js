import apiEndpoints from './apiEndpoints.js'

const config = {
  appName: "RISE",
  baseURL: "https://awsbvxnval0001:5000/",
  apiEndpoints,
  toastNotify: {
    default: {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    },
  },
  planning: {
    // devBaseUrl: "https://predev.iabot.rise.apps.jnj.com",
    devBaseUrl: "https://dev.iabot.rise.apps.jnj.com",
    // https://appdevtools.jnj.com/api/
  },
  ROWS_PER_PAGE: 10,
  agentManagement: {},
  env: "local", // use local for system
  LOGOUT_TIMEOUT: 1000 * 60 * 30, // miliseconds
  AUTOLOGOUT_TIME: 0, // seconds
  API_TIMEOUT: 30000, // miliseconds
  REFRESH_PERMISSION_TIME: 300000, // miliseconds
};
export default config;

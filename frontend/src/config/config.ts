import apiEndpoints from "./apiEndpoints";

interface ToastNotifyConfig {
  position: string;
  autoClose: number;
  hideProgressBar: boolean;
  closeOnClick: boolean;
  pauseOnHover: boolean;
  draggable: boolean;
  progress: undefined;
}

interface Config {
  appName: string;
  baseURL: string;
  apiEndpoints: typeof apiEndpoints;
  toastNotify: {
    default: ToastNotifyConfig;
  };
  ROWS_PER_PAGE: number;
  agentManagement: Record<string, unknown>;
  env: string;
  LOGOUT_TIMEOUT: number;
  AUTOLOGOUT_TIME: number;
  API_TIMEOUT: number;
  REFRESH_PERMISSION_TIME: number;
}

const config: Config = {
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
  ROWS_PER_PAGE: 10,
  agentManagement: {},
  env: "local", // use local for system
  LOGOUT_TIMEOUT: 1000 * 60 * 30, // milliseconds
  AUTOLOGOUT_TIME: 0, // seconds
  API_TIMEOUT: 30000, // milliseconds
  REFRESH_PERMISSION_TIME: 300000, // milliseconds
};

export default config;
// // import axios from "axios";

// // const axiosInstance = axios.create({
// //   baseURL: process.env.STAR_API_URL ?? "http://localhost:3001/api",
// // });

// // axiosInstance.interceptors.request.use(
// //   (config:any) => {
// //     const token = sessionStorage.getItem("msal_id_token");
// //     if (token) {
// //       config.headers.Authorization = `Bearer ${token}`;
// //     }
// //     return config;
// //   },
// //   (error) => {
// //     return Promise.reject(error);
// //   }
// // );

// // axiosInstance.interceptors.response.use(
// //   (response) => response,
// //   (error) => {
// //     if (error.response && error.response?.data?.message === "Session Expired") {
// //       sessionStorage.clear();
// //       window.location.href = "/session-expired";
// //     }
// //     if (error.response && error.response.status === 404) {
// //       window.location.href = "/not-found";
// //     }

// //     return Promise.reject(error);
// //   }
// // );

// // export default axiosInstance;

// // iasphere/src/axiosInstance.ts
// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: process.env.STAR_API_URL ?? "http://localhost:3001/api",
// });

// // const token = sessionStorage.getItem("msal_id_token");

// // export const AxiosInstance = new AxiosInstanceClass(
// //   `${
// //     process.env.REACT_APP_BACKEND_URL
// //       ? process.env.REACT_APP_BACKEND_URL
// //       : "http://localhost:3001"
// //   }`
// // ).init(token);

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = sessionStorage.getItem("msal_id_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.data?.message === "Session Expired") {
//       sessionStorage.clear();
//       window.location.href = "/session-expired";
//     }
//     if (error.response?.status === 404) {
//       window.location.href = "/not-found";
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL ?? process.env.STAR_API_URL ?? 'http://localhost:3001/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// ------------------ TOKEN HELPERS ------------------

const getAccessToken = () => cookies.get('token');
const getRefreshToken = () => cookies.get('refreshToken');
const getTokenExpiry = () => cookies.get('tokenValidity');

const isTokenExpired = () => {
  const expiry = getTokenExpiry();
  if (!expiry) return true;

  return Date.now() > new Date(expiry).getTime();
};

const clearSession = () => {
  cookies.remove('token');
  cookies.remove('refreshToken');
  cookies.remove('tokenValidity');
  sessionStorage.clear();
  window.location.href = '/session-expired';
};

const refreshBackendToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    const userId = sessionStorage.getItem('userId');

    if (!refreshToken || !userId) return null;

    const response = await axios.patch(`${API_BASE_URL}/auth/refreshToken/${userId}`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRT, expiresOn } = response.data.data;

    cookies.set('token', accessToken, { path: '/' });
    cookies.set('refreshToken', newRT, { path: '/' });
    cookies.set('tokenValidity', expiresOn, { path: '/' });

    return accessToken;
  } catch (err) {
    clearSession();
    return null;
  }
};

// ------------------ REQUEST INTERCEPTOR ------------------

axiosInstance.interceptors.request.use(
  async (config) => {
    let token = getAccessToken();

    // Refresh token automatically if expired
    if (!token || isTokenExpired()) {
      token = await refreshBackendToken();
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (err) => Promise.reject(err)
);

// ------------------ RESPONSE INTERCEPTOR ------------------

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // If request already retried → logout
    if (originalRequest._retry) {
      clearSession();
      return Promise.reject(error);
    }

    // Handle backend "Session Expired"
    if (error.response?.data?.message === 'Session Expired') {
      clearSession();
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized → refresh token
    if (error.response?.status === 401) {
      originalRequest._retry = true;
      const token = await refreshBackendToken();

      if (token) {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      }
    }

    // Handle 404 → redirect
    if (error.response?.status === 404) {
      window.location.href = '/not-found';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

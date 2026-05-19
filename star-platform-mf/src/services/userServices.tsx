import axios from 'axios';
import Cookies from 'universal-cookie';
import axiosInstance from './axiosInstance';
import { getAccessToken } from '../utils/tokenService';
const cookies = new Cookies();

const AUTH_API_URL = process.env.AUTH_API_URL;
const INSIGHTS_API_URL = process.env.REACT_APP_BACKEND_URL;

const SESSION_EXPIRED_ROUTE = '/session-expired';

const buildAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
  Accept: 'application/json',
});

const redirectToSessionExpired = () => {
  if (window.location.pathname !== SESSION_EXPIRED_ROUTE) {
    window.location.href = SESSION_EXPIRED_ROUTE;
  }
};

const isSessionExpiredError = (errorOrResponse: any) => {
  const data = errorOrResponse?.response?.data ?? errorOrResponse?.data ?? {};
  const message = `${data?.message ?? errorOrResponse?.message ?? ''}`.toLowerCase();
  return (
    message.includes('session expired') ||
    message.includes('session-expired') ||
    data?.errorCode === 'SESSION_EXPIRED'
  );
};

// FUNCTION FOR GETTING NEW USER INFO AND FETCHING AD GROUPS
export const loginInsights = async (data: any) => {
  // const token = cookies.get('iasphere_id_token');
  const token = await getAccessToken();
  if (!token) {
    console.log('Token not ready yet');
    return false;
  }

  try {
    await axios.post(`${INSIGHTS_API_URL}auth/loginInsights`, data, {
      headers: buildAuthHeaders(token),
    });

    return true;
  } catch (error: any) {
    console.error('loginInsights failed', error);

    if (isSessionExpiredError(error)) {
      redirectToSessionExpired();
    }

    return false;
  }
};

// FUNCTION FOR GETTING USER PERMISSINS USING INSIGHTS AUTH API
export const getUserPermissions = async () => {
  try {
    // const AUTH_API_URL = process.env.AUTH_API_URL;

    if (!AUTH_API_URL) {
      console.error('AUTH_API_URL is not defined');
      return null;
    }

    // Get token directly from MSAL cache — no cookies, no race conditions
    const token = await getAccessToken();

    if (!token) {
      console.warn('getUserPermissions: no token available');
      return null;
    }

    const response = await axios.get(`${AUTH_API_URL}/auth/getUserPermission`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (isSessionExpiredError(response)) {
      redirectToSessionExpired();
      return null;
    }

    return response.data;
  } catch (error: any) {
    if (isSessionExpiredError(error)) {
      redirectToSessionExpired();
      return null;
    }
    return error.response;
  }
};

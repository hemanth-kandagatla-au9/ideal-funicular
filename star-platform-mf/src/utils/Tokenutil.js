import Cookies from 'universal-cookie';

const cookies = new Cookies();
const DOMAIN = window.location.hostname.includes('localhost') ? 'localhost' : '.ias.apps.jnj.com';
const COOKIE_PATH = '/';
const SESSION_KEYS = [
  'iasphere_access_token',
  'iasphere_id_token',
  'refreshToken',
  'tokenValidity',
];
const APP_KEYS = [
  'user_fullname',
  'profile_image',
  'username',
  'isAuthenticated',
  'iasphere_permissions',
  'iasphere_access_token',
  'iasphere_id_token',
  'iasphere_refresh_token',
  'permissions',
  'user_email',
];

export const getAccessToken = () => cookies.get('iasphere_access_token');
export const getRefreshToken = () => cookies.get('refreshToken');

// export const setTokens = (accessToken, refreshToken, expiresOn) => {
//   cookies.set('iasphere_id_token', accessToken, {
//     path: '/',
//     domain: DOMAIN,
//     secure: true,
//     sameSite: 'strict',
//     maxAge: expiresOn,
//   });

//   cookies.set('refreshToken', refreshToken, {
//     path: '/',
//     domain: DOMAIN,
//     secure: true,
//     sameSite: 'strict',
//   });

//   cookies.set('tokenValidity', expiresOn, {
//     path: '/',
//     domain: DOMAIN,
//   });
// };

export const isTokenExpired = () => {
  const expiry = cookies.get('tokenValidity');
  if (!expiry) return true;

  return Date.now() > new Date(expiry).getTime();
};

export const clearTokenSession = () => {
  SESSION_KEYS.forEach((key) => {
    cookies.remove(key, { path: COOKIE_PATH });
    cookies.remove(key, { path: COOKIE_PATH, domain: DOMAIN });
  });
  sessionStorage.clear();
};

export const clearAllCookies = () => {
  try {
    clearTokenSession();
  } catch (e) {
    console.log(e);
  }

  // remove other application cookies that may store user info
  APP_KEYS.forEach((key) => {
    try {
      cookies.remove(key, { path: COOKIE_PATH });
      cookies.remove(key, { path: COOKIE_PATH, domain: DOMAIN });
    } catch (e) {
      console.log(e);
    }
  });
  try {
    sessionStorage.clear();
    localStorage.removeItem('persist:root');
  } catch (e) {
    console.log(e);
  }
};

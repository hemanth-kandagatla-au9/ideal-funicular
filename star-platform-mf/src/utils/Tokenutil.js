import Cookies from 'universal-cookie';

const cookies = new Cookies();
const DOMAIN = window.location.hostname.includes('localhost') ? 'localhost' : 'ias.apps.jnj.com';

export const getAccessToken = () => cookies.get('token');
export const getRefreshToken = () => cookies.get('refreshToken');

export const setTokens = (accessToken, refreshToken, expiresOn) => {
  cookies.set('token', accessToken, {
    path: '/',
    domain: DOMAIN,
    secure: true,
    sameSite: 'strict',
    maxAge: expiresOn,
  });

  cookies.set('refreshToken', refreshToken, {
    path: '/',
    domain: DOMAIN,
    secure: true,
    sameSite: 'strict',
  });

  cookies.set('tokenValidity', expiresOn, {
    path: '/',
    domain: DOMAIN,
  });
};

export const isTokenExpired = () => {
  const expiry = cookies.get('tokenValidity');
  if (!expiry) return true;

  return Date.now() > new Date(expiry).getTime();
};

export const clearTokenSession = () => {
  cookies.remove('token', { path: '/', domain: DOMAIN });
  cookies.remove('refreshToken', { path: '/', domain: DOMAIN });
  cookies.remove('tokenValidity', { path: '/', domain: DOMAIN });
  sessionStorage.clear();
};

export const clearAllCookies = () => {
  try {
    clearTokenSession();
  } catch (e) {
    console.log(e);
  }

  // remove other application cookies that may store user info
  const keys = [
    'user_fullname',
    'profile_image',
    'username',
    'isAuthenticated',
    'iasphere_permissions',
    'iasphere_access_token',
    'iasphere_refresh_token',
  ];
  keys.forEach((k) => {
    try {
      cookies.remove(k, { path: '/', domain: DOMAIN });
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

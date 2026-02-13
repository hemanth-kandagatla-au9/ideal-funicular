import React, { useEffect } from 'react';
import Cookies from 'universal-cookie';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../../utils/msalConfig';

const cookies = new Cookies();

function removeCookieEverywhere(name: string) {
  try {
    // default

    cookies.remove(name, { path: '/', domain: "localhost" });
    // known prod domain (from PageLayout)
    cookies.remove(name, { path: '/', domain: '.ias.apps.jnj.com' });
    // fallback: also try without explicit path
    cookies.remove(name);
  } catch {
    // ignore
  }
}

export const SessionExpired: React.FC = () => {
  const { instance } = useMsal();

  useEffect(() => {
    // Clear tokens / session state
    try {
      sessionStorage.clear();
      sessionStorage.removeItem('msal_id_token');
      sessionStorage.removeItem('msal_access_token');
    } catch {
      // ignore
    }

    // Clear app-local cached state (safe keys only)
    try {
      localStorage.removeItem('persist:root');
      localStorage.removeItem('permissions');
    } catch {
      // ignore
    }

    // Clear known cookies used across the app/session management
    [
      'token',
      'refreshToken',
      'tokenValidity',
      'iasphere_access_token',
      'iasphere_id_token',
      'isAuthenticated',
      'username',
      'user_fullname',
      'profile_image',
    ].forEach(removeCookieEverywhere);

    // If there are other cookies, leaving them alone avoids breaking unrelated apps.
  }, []);

  const onLogin = async () => {
    try {
      await instance.loginRedirect({
        ...loginRequest,
      });
    } catch (e) {
      // fallback: full reload to root (bootstrap will trigger login)
      window.location.href = '/';
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: '#fff',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 520 }}>
        <h2 style={{ marginBottom: 8 }}>Session Timed Out!</h2>
        <p style={{ marginBottom: 20, color: '#666' }}>
          Your session has expired for security reasons. Please login again to continue.
        </p>
        <button
          type="button"
          onClick={onLogin}
          style={{
            background: '#2f6fed',
            color: '#fff',
            border: 'none',
            borderRadius: 20,
            padding: '10px 26px',
            cursor: 'pointer',
            fontSize: 16,
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default SessionExpired;

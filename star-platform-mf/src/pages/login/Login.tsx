import { useMsal } from '@azure/msal-react';
import React, { useEffect } from 'react';
import { loginRequest } from '../../utils/msalConfig';
import { CircleLoader } from 'react-spinners';

export const Login = () => {
  const { instance } = useMsal();

  const actionLogin = async () => {
    try {
      await instance.initialize();

      const accounts = instance.getAllAccounts();
      if (accounts.length > 0) {
        window.location.href = '/app/workflow';
        return;
      }

      const currentUrl = window.location.pathname + window.location.search;
      const existingSaved = sessionStorage.getItem('postLoginRedirect');

      const isDefaultOrLogin =
        currentUrl === '/login' ||
        currentUrl === '/app/workflow' ||
        currentUrl === '/app' ||
        currentUrl === '/';

      if (!isDefaultOrLogin && !existingSaved) {
        sessionStorage.setItem('postLoginRedirect', currentUrl);
      }

      await instance.loginRedirect({ ...loginRequest });
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  useEffect(() => {
    actionLogin();
  }, []);

  return (
    <div
      style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <CircleLoader color="#825bff" />
    </div>
  );
};

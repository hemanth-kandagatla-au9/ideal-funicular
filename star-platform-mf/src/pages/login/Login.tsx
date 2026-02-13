import { useMsal } from '@azure/msal-react';
import React, { useEffect } from 'react';
import { loginRequest } from '../../utils/msalConfig';
import { authAction } from '../../services/userServices';
import { CircleLoader } from 'react-spinners';

export const Login = () => {
  const { instance, accounts } = useMsal();

  const actionLogin = async () => {
    try {
      await instance.initialize();

      const response = await instance.handleRedirectPromise();

      if (!response) {
        await instance.loginRedirect({
          ...loginRequest,
        });
      }

      if (response) {
        const { idToken, accessToken } = response;
        sessionStorage.setItem('msal_id_token', idToken);
        sessionStorage.setItem('msal_access_token', accessToken);
        // if (refreshToken) {
        //   sessionStorage.setItem("msal_refresh_token", refreshToken);
        // }
        const loginPayload = {
          action: 'login',
          accessToken: accessToken,
        };
        // authAction(loginPayload);

        // After successful MSAL redirect handling, navigate to main app page.
        try {
          window.location.href = '/app/workflow';
        } catch (e) {
          // fallback
          console.log('redirect to app failed', e);
        }
      }
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  useEffect(() => {
    actionLogin();
  }, []);
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircleLoader color="#825bff" />
    </div>
  );
};

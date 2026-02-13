import React, { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../../utils/msalConfig';
import styles from './Logout.module.scss';
import { clearAllCookies } from '../../utils/Tokenutil';

const Logout = () => {
  useEffect(() => {
    // clear cookies and storage
    try {
      clearAllCookies();
    } catch (e) {
      console.log(e);
    }
    return () => {};
  }, []);
  const { instance } = useMsal();

  const handleLogin = async () => {
    try {
      await instance.initialize();

      // If MSAL is not configured in env, fallback to direct navigation
      const authority = process.env.REACT_APP_AUTHORITY_URL || '';
      if (!authority) {
        window.location.href = '/app/workflow';
        return;
      }

      await instance.loginRedirect({ ...loginRequest });
    } catch (err) {
      console.error('Login redirect failed', err);
      // fallback to app route if redirect fails
      try {
        window.location.href = '/app/workflow';
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <div className={styles.logoutPage}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <span className={styles.check}>✔</span>
        </div>

        <div className={styles.title}>
          Logged out
          <div>successfully!</div>
        </div>

        <div className={styles.subtitle}>You have been securely logged out of your account.</div>

        <div className={styles.redirectText}>You can log back in using your corporate account.</div>

        <button onClick={handleLogin} className={styles.goLogin}>
          Go to Login
        </button>

        <div className={styles.cardFooter}>Thank you for using our service</div>
      </div>
    </div>
  );
};

export default Logout;

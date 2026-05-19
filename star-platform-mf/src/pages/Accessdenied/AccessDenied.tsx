import React from 'react';
import styles from './AccessDenied.module.scss';
import unauthorized from '../../assets/Unauthorized.svg';
const AccessDeniedPage = () => {
  return (
    <div className={styles.access_denied_container}>
      <div className={styles.access_denied_card}>
        <h2 className={styles.access_denied_title}>Access Denied</h2>
        <p className={styles.access_denied_message}>
          Sorry, but you don’t have permission to access this page.
        </p>
      </div>
      <div className={styles.icon_wrapper_image}>
        <img src={unauthorized} alt="Unauthorized Access" className="unauthorized-icon" />
      </div>
    </div>
  );
};

export default AccessDeniedPage;

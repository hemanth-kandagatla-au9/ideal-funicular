import React from 'react';
import styles from './css/dashboard.module.scss';
import LandingPageHeader from './DashboardHeader';

const Dashboard: React.FC = () => {
  return (
    <div className={styles.platformDashboard}>
      <div>{/* <LandingPageHeader /> */}</div>
    </div>
  );
};

export default Dashboard;

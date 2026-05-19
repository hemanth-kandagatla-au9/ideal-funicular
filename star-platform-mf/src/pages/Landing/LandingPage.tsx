import React, { useEffect } from 'react';
import styles from '../../styles/landing.module.scss';
import Cookies from 'universal-cookie';
import Dashboard from '../../components/Dashboard/Dashboard';
// import { setPermissions } from '../../redux/slices/permissionSlice';
import { useDispatch } from 'react-redux';
const cookies = new Cookies();

const LandingPage: React.FC = () => {
  return (
    <div className={styles.landingContainer}>
      {/* Top Section */}

      {/* Bottom Section */}
      <div className={styles.bottomSection}>{/* <Dashboard /> */}</div>
    </div>
  );
};

export default LandingPage;

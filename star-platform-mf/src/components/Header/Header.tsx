import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import starLogo from '../../assets/IAsphere.svg';
import Logo from '../../assets/johnson-johnson-logo.svg';
import Dashboardheader from '../Dashboard/DashboardHeader';
import styles from './Header.module.scss';

import { clearAllCookies } from '../../utils/Tokenutil';

const cookies = new Cookies();

function Header({ instance }: any) {
  const username = cookies.get('user_fullname') ?? 'User';
  const profileImage = cookies.get('profile_image');
  // console.log("username = ",username)
  // console.log("profileImage = ",profileImage)

  const getInitials = (name: string = ''): string => {
    // console.log("name in get initials = ",name)
    return name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0].toUpperCase())
      .slice(0, 2)
      .join('');
  };
  const isWorkflowCanvas = location.pathname === '/app/workflow/myspace-add';
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (menuRef.current.contains(e.target as Node)) return;
      if (open) {
        setClosing(true);
        setTimeout(() => {
          setOpen(false);
          setClosing(false);
        }, 180);
      }
    };

    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [open]);

  const handleLogout = () => {
    try {
      clearAllCookies();
    } catch (e) {
      console.log(e);
    }
    // navigate to the logout page which also clears session and redirects
    window.location.href = '/logout';
  };

  return (
    <div className={styles.topSection} style={{ backgroundColor: '#F8F3FF' }}>
      <div className={styles.header}>
        <div className={styles.projectContainer}>
          <img src={Logo} className={styles.JJLogo} />
        </div>

        <div>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div className={styles.headerJNJ}>
              <div className={styles.title}>
                <img
                  src={starLogo}
                  alt="logo"
                  height={44}
                  width={64}
                  className={styles.titleimage}
                />
              </div>
            </div>
          </Link>
        </div>

        <div className={styles.userIconContainer} ref={menuRef}>
          {profileImage ? (
            <img className={styles.profile} src={profileImage} alt="profile" />
          ) : (
            <div className={styles.profileinitials}>{getInitials(username)}</div>
          )}

          <span className={styles.profilename}>{username}</span>

          <button
            aria-label="open user menu"
            className={styles.arrowBtn}
            onClick={(e) => {
              e.stopPropagation();
              if (open) {
                setClosing(true);
                setTimeout(() => {
                  setOpen(false);
                  setClosing(false);
                }, 180);
              } else {
                setOpen(true);
              }
            }}
          >
            <span className={styles.arrow}>
              {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </span>
            {/* <span className={styles.arrow}>
              {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </span> */}
          </button>

          <div
            className={`${styles.dropdown} ${open ? styles.open : ''} ${closing ? styles.closing : ''}`}
            role="menu"
          >
            <div className={styles.dropdownItem} onClick={handleLogout}>
              Logout
            </div>
          </div>
        </div>
      </div>
      {isWorkflowCanvas ? null : <Dashboardheader />}
    </div>
  );
}

export default Header;

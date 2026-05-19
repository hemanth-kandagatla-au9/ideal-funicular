// import React from 'react';
// import { ChevronDown, ChevronUp } from 'lucide-react';
// import { useEffect, useRef, useState } from 'react';
// import { Link, useLocation, useHistory } from 'react-router-dom';
// import Cookies from 'universal-cookie';
// import starLogo from '../../assets/IAsphere.svg';
// import Logo from '../../assets/johnson-johnson-logo.svg';
// import Dashboardheader from '../Dashboard/DashboardHeader';
// import styles from './Header.module.scss';
// import helpcontent from '../../assets/helpcontent.svg';
// import Home from '../../assets/Home.svg';
// import { clearAllCookies } from '../../utils/Tokenutil';
// import { loginInsights } from '../../services/userServices';
// import { getAccessToken } from '../../utils/tokenService';

// import { shouldHideHeader } from '../../utils/hooks/layoutUtils';
// import Tooltip from '../Tooltip/Tooltip';

// const cookies = new Cookies();
// function Header({ instance }: any) {
//   // const username = cookies.get('user_fullname') ?? 'User';
//   const [username] = useState<string | null>(() => {
//     return cookies.get('user_fullname') ?? '';
//   });
//   const profileImage = cookies.get('profile_image');
//   const { pathname } = useLocation();
// console.log("pathname = ",pathname)
//   const getInitials = (name: string = ''): string => {
//     return name
//       .trim()
//       .split(/\s+/)
//       .filter(Boolean)
//       .map((part) => part[0].toUpperCase())
//       .slice(0, 2)
//       .join('');
//   };
//   const history = useHistory();

//   const hideHeader = shouldHideHeader(pathname);
//   console.log("HEADER pathname:", pathname);
// console.log("WINDOW pathname:", window.location.pathname);
// console.log("hideHeader pathname:", shouldHideHeader(pathname));
//   const isHelpRoute = pathname === '/app/workflow/helpcontent';
//   const isWorkflowCanvas = location.pathname === '/app/workflow/myspace-add';
//   const [open, setOpen] = useState(false);
//   const [closing, setClosing] = useState(false);
//   const menuRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const onDocClick = (e: MouseEvent) => {
//       if (!menuRef.current) return;
//       if (menuRef.current.contains(e.target as Node)) return;
//       if (open) {
//         setClosing(true);
//         setTimeout(() => {
//           setOpen(false);
//           setClosing(false);
//         }, 180);
//       }
//     };

//     document.addEventListener('click', onDocClick);
//     return () => document.removeEventListener('click', onDocClick);
//   }, [open]);

//   const handleHelpContent = () => {
//     return (
//       <div
//         className={styles.iconBox}
//         onClick={() => {
//           history.push(isHelpRoute ? '/app/workflow' : '/app/workflow/helpcontent');
//         }}
//       >
//         {/* {isHelpRoute ? <img src={helpcontent} alt="agent" /> : <img src={helpcontent} alt="agent" />}  */}

//         {isHelpRoute ? (
//           <div className={styles.Homebutton}>
//             <img src={Home} alt="agent" />
//             <span>Back to Home</span>
//           </div>
//         ) : (
//           <Tooltip content={'Help Content'} position="bottom">
//             <div className={styles.helpcontent}>
//               <img src={helpcontent} alt="agent" />
//             </div>
//           </Tooltip>
//         )}
//       </div>
//     );
//   };

//   const userIconContainer = () => {
//     return (
//       <div className={styles.userIconContainer} ref={menuRef}>
//         {profileImage ? (
//           <img className={styles.profile} src={profileImage} alt="profile" />
//         ) : (
//           <div className={styles.profileinitials}>{getInitials(username ?? '')}</div>
//         )}

//         <span className={styles.profilename}>{username}</span>

//         <button
//           aria-label="open user menu"
//           className={styles.arrowBtn}
//           onClick={(e) => {
//             e.stopPropagation();
//             if (open) {
//               setClosing(true);
//               setTimeout(() => {
//                 setOpen(false);
//                 setClosing(false);
//               }, 180);
//             } else {
//               setOpen(true);
//             }
//           }}
//         >
//           <span className={styles.arrow}>
//             {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//           </span>
//           {/* <span className={styles.arrow}>
//               {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//             </span> */}
//         </button>

//         <div
//           className={`${styles.dropdown} ${open ? styles.open : ''} ${closing ? styles.closing : ''}`}
//           role="menu"
//         >
//           <div className={styles.dropdownItem} onClick={handleLogout}>
//             Logout
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const handleLogout = async () => {
//     const token = await getAccessToken();

//     try {
//       clearAllCookies();
//       await loginInsights({
//         action: 'logout',
//         accessToken: token,
//       });
//     } catch (e) {
//       console.log('logout');
//     }
//     // navigate to the logout page which also clears session and redirects
//     window.location.href = '/logout';
//   };

//   return (
//     <div className={styles.topSection} style={{ backgroundColor: '#F8F3FF' }}>
//       <div className={`${styles.header} ${open ? styles.dropdownActive : ''}`}>
//         <div className={styles.projectContainer}>
//           <img src={Logo} className={styles.JJLogo} />
//         </div>

//         <div>
//           <Link to="/" style={{ textDecoration: 'none' }}>
//             <div className={styles.headerJNJ}>
//               <div className={styles.title}>
//                 <img
//                   src={starLogo}
//                   alt="logo"
//                   height={44}
//                   width={64}
//                   className={styles.titleimage}
//                 />
//               </div>
//             </div>
//           </Link>
//         </div>

//         <div style={{ display: 'flex', gap: '1rem' }}>
//           {handleHelpContent()}
//           {userIconContainer()}
//         </div>
//       </div>

//       {hideHeader ? null : <Dashboardheader />}
//     </div>
//   );
// }

// export default Header;
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie';
import starLogo from '../../assets/IAsphere.svg';
import Logo from '../../assets/johnson-johnson-logo.svg';
import Dashboardheader from '../Dashboard/DashboardHeader';
import styles from './Header.module.scss';
import helpcontent from '../../assets/helpcontent.svg';
import Home from '../../assets/Home.svg';
import { clearAllCookies } from '../../utils/Tokenutil';
import { loginInsights } from '../../services/userServices';
import { getAccessToken } from '../../utils/tokenService';
import { shouldHideHeader } from '../../utils/hooks/layoutUtils';
import Tooltip from '../Tooltip/Tooltip';
import { useCurrentPath } from '../../utils/useCurrentPath';

const cookies = new Cookies();

function Header({ instance }: any) {
  const history = useHistory();
  const { pathname } = useLocation(); // keeps rerender trigger

  const [username] = useState<string | null>(() => {
    return cookies.get('user_fullname') ?? '';
  });

  const profileImage = cookies.get('profile_image');

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const currentPath = useCurrentPath();

  // outside click close menu
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

    return () => {
      document.removeEventListener('click', onDocClick);
    };
  }, [open]);

  const getInitials = (name: string = ''): string => {
    return name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0].toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const hideHeader = shouldHideHeader(currentPath);

  const isHelpRoute = currentPath === '/app/workflow/helpcontent';

  const handleHelpContent = () => {
    return (
      <div
        className={styles.iconBox}
        onClick={() => {
          history.push(isHelpRoute ? '/app/workflow' : '/app/workflow/helpcontent');
        }}
      >
        {isHelpRoute ? (
          <div className={styles.Homebutton}>
            <img src={Home} alt="home" />
            <span>Back to Home</span>
          </div>
        ) : (
          <Tooltip content="Help Content" position="bottom">
            <div className={styles.helpcontent}>
              <img src={helpcontent} alt="help" />
            </div>
          </Tooltip>
        )}
      </div>
    );
  };

  const handleLogout = async () => {
    const token = await getAccessToken();

    try {
      clearAllCookies();

      await loginInsights({
        action: 'logout',
        accessToken: token,
      });
    } catch (e) {
      console.log('logout');
    }

    window.location.href = '/logout';
  };

  const userIconContainer = () => {
    return (
      <div className={styles.userIconContainer} ref={menuRef}>
        {profileImage ? (
          <img className={styles.profile} src={profileImage} alt="profile" />
        ) : (
          <div className={styles.profileinitials}>{getInitials(username ?? '')}</div>
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
        </button>

        <div
          className={`${styles.dropdown} ${
            open ? styles.open : ''
          } ${closing ? styles.closing : ''}`}
          role="menu"
        >
          <div className={styles.dropdownItem} onClick={handleLogout}>
            Logout
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.topSection} style={{ backgroundColor: '#F8F3FF' }}>
      <div className={`${styles.header} ${open ? styles.dropdownActive : ''}`}>
        <div className={styles.projectContainer}>
          <img src={Logo} className={styles.JJLogo} alt="JNJ" />
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

        <div style={{ display: 'flex', gap: '1rem' }}>
          {handleHelpContent()}
          {userIconContainer()}
        </div>
      </div>

      {hideHeader ? null : <Dashboardheader />}
    </div>
  );
}

export default Header;

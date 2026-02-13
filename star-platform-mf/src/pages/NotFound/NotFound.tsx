import React from 'react';
import { useHistory } from 'react-router-dom';
import '../../styles/NotFound.scss';
import NotFoundTextImg from '../../assets/notfoundtext.png'; // first image ("404 Oops! Page Not Found" + text)
import NotFoundBigImg from '../../assets/notfoundimage404.png'; // second big 404 illustration

const NotFound = () => {
  const history = useHistory();

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <img src={NotFoundTextImg} alt="404 Header Text" className="not-found-text-img" />

        <img src={NotFoundBigImg} alt="404 Illustration" className="not-found-big-img" />

        <button onClick={() => history.push('/')} className="not-found-btn">
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;

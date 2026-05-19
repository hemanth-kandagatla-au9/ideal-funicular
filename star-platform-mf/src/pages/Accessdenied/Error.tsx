import React from 'react';
import ApiError from '../../assets/ApiError.svg';

const Error = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '65vh',
        flexDirection: 'column',
        gap: '2px',
      }}
    >
      <img src={ApiError} alt="Api Error" />
      <h4>Failed to load permissions.</h4>
      <h5>If this persists, please refresh the page or contact support.</h5>
      <button
        style={{
          background: '#2961F4',
          borderRadius: '16px',
          border: 'none',
          padding: '8px',
          color: 'white',
        }}
        onClick={() => (window.location.href = '/')}
      >
        Refresh
      </button>
    </div>
  );
};

export default Error;

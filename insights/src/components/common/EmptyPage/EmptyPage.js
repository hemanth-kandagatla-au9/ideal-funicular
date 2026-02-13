import React from 'react';
import './emptypage.css';

const EmptyPage = ({title, subtitle}) => {
  return (
    <div className="empty-state-container">
      <div className="empty-state">
        <div className="illustration">
          <div className="calendar-container">
            <div className="folder-bg">
              <div className="folder-tab"></div>
            </div>
            <div className="calendar-base">
              <div className="calendar-header">
                <div className="calendar-dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
              <div className="calendar-grid">
                <div className="calendar-cell"></div>
                <div className="calendar-cell filled"></div>
                <div className="calendar-cell"></div>
                <div className="calendar-cell"></div>
                <div className="calendar-cell filled"></div>
                <div className="calendar-cell"></div>
                <div className="calendar-cell filled"></div>
                <div className="calendar-cell"></div>
                <div className="calendar-cell"></div>
                <div className="calendar-cell"></div>
                <div className="calendar-cell"></div>
                <div className="calendar-cell"></div>
              </div>
            </div>
          </div>
        </div>
        <h2 className="title">{title}</h2>
        <p className="subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default EmptyPage;
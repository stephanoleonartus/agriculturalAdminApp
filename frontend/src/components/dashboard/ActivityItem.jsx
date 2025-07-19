import React from 'react';
import '../../styles/dashboard/ActivityItem.css';

const ActivityItem = ({ icon, title, time, color }) => {
  return (
    <div className="activity-item">
      <div className={`activity-item-icon ${color}`}>
        <i className={icon}></i>
      </div>
      <div className="activity-item-info">
        <p className="activity-item-title">{title}</p>
        <p className="activity-item-time">{time}</p>
      </div>
    </div>
  );
};

export default ActivityItem;

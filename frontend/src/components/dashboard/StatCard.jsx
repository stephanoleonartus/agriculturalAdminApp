import React from 'react';
import '../../styles/dashboard/StatCard.css';

const StatCard = ({ title, value, change, trend, icon, color }) => {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-card-info">
        <p className="stat-card-title">{title}</p>
        <p className="stat-card-value">{value}</p>
        <div className={`stat-card-trend ${trend}`}>
          <i className={`fas fa-arrow-${trend === 'up' ? 'up' : 'down'}`}></i>
          <span>{change} from last month</span>
        </div>
      </div>
      <div className="stat-card-icon">
        <i className={icon}></i>
      </div>
    </div>
  );
};

export default StatCard;

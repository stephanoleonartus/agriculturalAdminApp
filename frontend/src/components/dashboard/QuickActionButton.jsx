import React from 'react';
import '../../styles/dashboard/QuickActionButton.css';

const QuickActionButton = ({ icon, label, color, onClick }) => {
  return (
    <button onClick={onClick} className={`quick-action-button ${color}`}>
      <i className={icon}></i>
      <span>{label}</span>
    </button>
  );
};

export default QuickActionButton;

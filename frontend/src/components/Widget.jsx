import React from 'react';
import '../styles/Widget.css';

const Widget = ({ title, value }) => {
  return (
    <div className="widget">
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  );
};

export default Widget;

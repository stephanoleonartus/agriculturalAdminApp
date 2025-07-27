import React from 'react';
import '../styles/OrderTracking.css';

const OrderTracking = ({ order }) => {
  const getStatusIndex = (status) => {
    const statuses = ['pending', 'confirmed', 'shipped', 'delivered'];
    return statuses.indexOf(status);
  };

  const statusIndex = getStatusIndex(order.status);

  return (
    <div className="order-tracking-container">
      <h4>Order Tracking</h4>
      <div className="tracking-timeline">
        <div className={`timeline-item ${statusIndex >= 0 ? 'completed' : ''}`}>
          <div className="timeline-dot"></div>
          <div className="timeline-content">
            <h5>Pending</h5>
            <p>Your order is pending confirmation.</p>
          </div>
        </div>
        <div className={`timeline-item ${statusIndex >= 1 ? 'completed' : ''}`}>
          <div className="timeline-dot"></div>
          <div className="timeline-content">
            <h5>Confirmed</h5>
            <p>Your order has been confirmed.</p>
          </div>
        </div>
        <div className={`timeline-item ${statusIndex >= 2 ? 'completed' : ''}`}>
          <div className="timeline-dot"></div>
          <div className="timeline-content">
            <h5>Shipped</h5>
            <p>Your order is on its way.</p>
          </div>
        </div>
        <div className={`timeline-item ${statusIndex >= 3 ? 'completed' : ''}`}>
          <div className="timeline-dot"></div>
          <div className="timeline-content">
            <h5>Delivered</h5>
            <p>Your order has been delivered.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;

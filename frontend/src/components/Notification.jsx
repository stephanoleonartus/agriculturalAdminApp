import React, { useState } from "react";
import "../styles/Notification.css";

function Notification() {
  const [open, setOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, title: "New Product Available", message: "Fresh tomatoes from Mbeya region", time: "2 min ago", unread: true },
    { id: 2, title: "Order Shipped", message: "Your order #AG001 has been shipped", time: "1 hour ago", unread: true },
    { id: 3, title: "Price Alert", message: "Maize price dropped by 10% in your area", time: "3 hours ago", unread: false },
    { id: 4, title: "New Farmer", message: "John Mwakyusa joined your network", time: "1 day ago", unread: false }
  ]);

  const toggleNotification = () => {
    setOpen(!open);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="notification-container">
      <div className="nav-icon" onClick={toggleNotification}>
        <div className="icon-container">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
          <span className="icon-label">Notifications</span>
        </div>
      </div>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <button className="mark-all-read">Mark all as read</button>
          </div>
          
          <div className="notification-list">
            {notifications.map(notification => (
              <div key={notification.id} className={`notification-item ${notification.unread ? 'unread' : ''}`}>
                <div className="notification-icon">
                  {notification.unread && <div className="unread-dot"></div>}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                </div>
                <div className="notification-content">
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  <span className="notification-time">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="notification-footer">
            <button className="view-all-btn">View All Notifications</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notification;
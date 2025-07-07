import React, { useState } from "react";
import "../styles/Notification.css"; // CSS styling

function Notification() {
  // 👉 This is state: tracks whether notification panel is open
  const [open, setOpen] = useState(false);

  // 👉 This is event: toggles open/close state
  const toggleNotification = () => {
    setOpen(!open);
  };

  return (
    <div className="notification-container">
      <button className="notification-icon" onClick={toggleNotification}>
        🔔
        {/* You can show a red dot if there's new notifications */}
        <span className="dot"></span>
      </button>

      {open && (
        <div className="notification-panel">
          <h4>Notifications</h4>
          <ul>
            <li>New product added in your region 🌾</li>
            <li>Farmer John posted a new harvest 🚜</li>
            <li>System update scheduled tonight ⚙️</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Notification;

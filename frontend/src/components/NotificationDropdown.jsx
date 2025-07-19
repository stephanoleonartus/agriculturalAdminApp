import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import '../styles/NotificationDropdown.css';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/v1/notifications/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setNotifications(response.data.results);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notification-dropdown">
      <div className="notification-dropdown-header">
        <p>Notifications</p>
      </div>
      <div className="notification-dropdown-body">
        {notifications.length > 0 ? (
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id}>
                <p>{notification.message}</p>
                <span>{new Date(notification.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No new notifications</p>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;

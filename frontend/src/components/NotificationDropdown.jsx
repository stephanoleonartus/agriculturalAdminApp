import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import '../styles/NotificationDropdown.css';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/notifications/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        
        // Handle different possible response structures
        const notificationData = response.data?.results || response.data || [];
        setNotifications(Array.isArray(notificationData) ? notificationData : []);
        setError(null);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('Failed to load notifications');
        setNotifications([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="notification-dropdown">
        <div className="notification-dropdown-header">
          <p>Notifications</p>
        </div>
        <div className="notification-dropdown-body">
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notification-dropdown">
        <div className="notification-dropdown-header">
          <p>Notifications</p>
        </div>
        <div className="notification-dropdown-body">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-dropdown">
      <div className="notification-dropdown-header">
        <p>Notifications</p>
      </div>
      <div className="notification-dropdown-body">
        {notifications && notifications.length > 0 ? (
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

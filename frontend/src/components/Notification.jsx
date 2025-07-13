import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // For notification links
import "../styles/Notification.css";

function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const notificationPanelRef = useRef(null);

  const API_BASE_URL = "/api/v1/notifications/notifications"; // Base URL

  const getToken = () => localStorage.getItem("authToken");

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    const token = getToken();
    if (!token) {
        // Not showing error for non-logged in users, just no notifications
        setNotifications([]);
        setUnreadCount(0);
        setLoading(false);
        return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Assuming paginated response
      const results = response.data.results || response.data || [];
      setNotifications(results);

      // Fetch unread count separately
      const countResponse = await axios.get(`${API_BASE_URL}/unread_count/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnreadCount(countResponse.data.unread_count || 0);

    } catch (err) {
      console.error("Error fetching notifications:", err.response?.data || err.message);
      setError("Failed to load notifications.");
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(); // Fetch on initial mount
    // TODO: Implement polling or WebSocket for real-time updates if needed
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationPanelRef.current && !notificationPanelRef.current.contains(event.target)) {
        // Check if the click is on the toggle button itself to avoid immediate re-open
        if (!event.target.closest('.notification-icon')) {
          setIsOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationPanelRef]);


  const toggleNotificationPanel = () => {
    setIsOpen(!isOpen);
    if (!isOpen) { // If opening, refresh notifications
      fetchNotifications();
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    const token = getToken();
    try {
      await axios.post(`${API_BASE_URL}/${notificationId}/mark_as_read/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh notifications list and count
      fetchNotifications();
    } catch (err) {
      console.error("Error marking notification as read:", err);
      // setError("Failed to mark as read.");
      alert("Failed to mark notification as read.");
    }
  };

  const handleMarkAllAsRead = async () => {
    const token = getToken();
    try {
      await axios.post(`${API_BASE_URL}/mark_all_as_read/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications(); // Refresh list
    } catch (err) {
      console.error("Error marking all as read:", err);
      // setError("Failed to mark all as read.");
      alert("Failed to mark all as read.");
    }
  };

  const NotificationItem = ({ notification }) => (
    <li className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
        onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}>
      {notification.link ? (
        <Link to={notification.link} onClick={() => setIsOpen(false)}>
          <p className="verb">{notification.verb}</p>
          {notification.description && <p className="description">{notification.description}</p>}
        </Link>
      ) : (
        <div>
          <p className="verb">{notification.verb}</p>
          {notification.description && <p className="description">{notification.description}</p>}
        </div>
      )}
      <span className="timestamp">{new Date(notification.timestamp).toLocaleString()}</span>
      {!notification.is_read && <div className="unread-indicator" title="Mark as read"></div>}
    </li>
  );

  return (
    <div className="notification-container" ref={notificationPanelRef}>
      <button className="notification-icon" onClick={toggleNotificationPanel}>
        🔔
        {unreadCount > 0 && <span className="dot notification-dot">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-panel">
          <div className="notification-panel-header">
            <h4>Notifications</h4>
            {notifications.length > 0 && unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead} className="mark-all-read-btn">
                Mark all as read
              </button>
            )}
          </div>
          {loading && <p className="loading-text">Loading...</p>}
          {error && <p className="error-text">{error}</p>}
          {!loading && !error && notifications.length === 0 && (
            <p className="empty-text">No notifications yet.</p>
          )}
          {!loading && !error && notifications.length > 0 && (
            <ul>
              {notifications.map((notif) => (
                <NotificationItem key={notif.id} notification={notif} />
              ))}
            </ul>
          )}

        </div>
      )}
    </div>
  );
}

export default Notification;
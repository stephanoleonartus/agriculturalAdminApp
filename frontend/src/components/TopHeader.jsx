import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import '../styles/TopHeader.css';
import Notification from "./Notification";
import ProfileDropdown from "./ProfileDropdown";
import { useLocation } from '../contexts/LocationContext';

const TopHeader = () => {
  const [messageCount, setMessageCount] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);
  const { location, locationError, locationLoading, permissionStatus, fetchLocation } = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      setIsAuthenticated(!!token);
      if (token) {
        try {
          const userRes = await axios.get('/api/auth/me/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(userRes.data);
          setUser(userRes.data);

          const cartRes = await axios.get('/api/products/cart/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCartItemCount(cartRes.data.total_items);

          const chatRes = await axios.get('/api/v1/chat/rooms/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMessageCount(chatRes.data.results.reduce((acc, room) => acc + room.unread_count, 0));
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    checkAuth();
    fetchLocation();

    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('authChange', checkAuth);
    };
  }, [fetchLocation]);

  return (
    <div className="top-header">
      <div className="top-header-left">
        {/* Delivery to region */}
        <div className="nav-item">
          <span>Delivery to: {locationLoading ? 'Loading...' : (location ? `${location.city}, ${location.country}` : 'N/A')}</span>
        </div>
      </div>
      <div className="top-header-right">
        {/* Message Icon */}
        <Link to="/chat" className="nav-item icon-link notification-container">
          <i className="fas fa-comment"></i>
          {messageCount > 0 && <span className="dot message-dot">{messageCount > 9 ? '9+' : messageCount}</span>}
        </Link>

        {/* Cart Icon */}
        <Link to="/cart" className="nav-item icon-link notification-container">
          <i className="fas fa-shopping-cart"></i>
          {cartItemCount > 0 && <span className="dot cart-dot">{cartItemCount > 9 ? '9+' : cartItemCount}</span>}
        </Link>

        <Notification /> {/* This is for general notifications */}

        {isAuthenticated && user ? (
          <div className="auth-links">
            <ProfileDropdown user={user} />
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="nav-item">
              <i className="fas fa-user"></i> Login
            </Link>
            <Link to="/auth" className="nav-item create-account-btn">
              Create Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopHeader;

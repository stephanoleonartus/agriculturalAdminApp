import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import '../styles/TopHeader.css';
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";
import SearchBar from './SearchBar';
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
          const userRes = await axios.get('/auth/me/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(userRes.data);
          setUser(userRes.data);

          const cartRes = await axios.get('/products/cart/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCartItemCount(cartRes.data.total_items);

          const chatRes = await axios.get('/chat/rooms/', {
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

  // Helper function to get delivery location text
  const getDeliveryLocationText = () => {
    if (locationLoading) {
      return 'Loading...';
    }
    
    if (user && user.region) {
      // Handle region object - extract the name property
      if (typeof user.region === 'object' && user.region.name) {
        return user.region.name;
      }
      // If it's already a string, return it
      if (typeof user.region === 'string') {
        return user.region;
      }
    }
    
    if (location) {
      return `${location.city}, ${location.country}`;
    }
    
    return 'N/A';
  };

  return (
    <div className="top-header">
      <div className="top-header-left">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="Agrilink" />
        </Link>
      </div>
      <div className="top-header-center">
        <SearchBar />
      </div>
      <div className="top-header-right">
        {/* Delivery to region */}
        <div className="nav-item">
          <i className="fas fa-map-marker-alt"></i>
          <span>
            Delivery to: {getDeliveryLocationText()}
          </span>
        </div>

        {/* Dashboard Link */}
        {isAuthenticated && (user?.role === 'farmer') && (
          <a href="/dashboard" target="_blank" rel="noopener noreferrer" className="nav-item icon-link">
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </a>
        )}
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

        <div className="notification-menu">
          <i className="fas fa-bell"></i>
          <NotificationDropdown />
        </div>

        {isAuthenticated && user ? (
          <div className="auth-links profile-menu">
            <i className="fas fa-user"></i>
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

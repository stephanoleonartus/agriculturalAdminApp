import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from '../api/axios';
import '../styles/navigation.css';
import '../styles/Auth.css';
import Notification from "./Notification";
import ProfileDropdown from "./ProfileDropdown";
import { useLocation } from '../contexts/LocationContext';

function Navigation() {
  const [messageCount, setMessageCount] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
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

          const chatRes = await axios.get('/v1/chat/rooms/', {
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


  const handleSearch = () => {
    // Handle search functionality
  };

  return (
    <div className="navbar">
      {/* Geolocation Status */}
      <div className="location-info-section" onClick={fetchLocation}>
        Deliver to: {location ? location.region : '...'}
      </div>
      {/* Logo Section */}
      <div className="logo">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          🌾 AgriLink.com
        </Link>
      </div>


      {/* Menu navigation */}
      <div className="menu">
        <Link to="/products" className="nav-item">Products</Link>
        <Link to="/farmers" className="nav-item">Farmers</Link>
        <Link to="/suppliers" className="nav-item">Region Supplier</Link>

        {/* Message Icon */}
        <Link to="/chat" className="nav-item icon-link notification-container">
          💬
          {messageCount > 0 && <span className="dot message-dot">{messageCount > 9 ? '9+' : messageCount}</span>}
        </Link>

        {/* Cart Icon */}
        <Link to="/cart" className="nav-item icon-link notification-container">
          🛒
          {cartItemCount > 0 && <span className="dot cart-dot">{cartItemCount > 9 ? '9+' : cartItemCount}</span>}
        </Link>

        <Notification /> {/* This is for general notifications */}

        {isAuthenticated && user ? (
          <div className="auth-links">
            <span className="nav-item">Hi, {user.first_name}</span>
            <button onClick={() => {
              axios.post('auth/logout/', {}, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
              });
              localStorage.removeItem('userInfo');
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              window.dispatchEvent(new Event('authChange'));
              navigate('/');
            }}>Logout</button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="nav-item">
              Login
            </Link>
            <Link to="/auth" className="nav-item create-account-btn">
              Create Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navigation;
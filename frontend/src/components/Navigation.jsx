import React from "react";
import { Link } from "react-router-dom";
import '../styles/navigation.css';
import '../styles/Auth.css';
import Notification from "./Notification";
import Profile from "./Profile";
import { useLocation } from '../contexts/LocationContext';

function Navigation() {
  // Placeholder for message count, to be fetched later
  const messageCount = 0; // Example: replace with actual count from state/context
  const [searchTerm, setSearchTerm] = React.useState('');
  const { location, locationError, locationLoading, permissionStatus, fetchLocation } = useLocation();


  const handleSearch = () => {
    // Handle search functionality
  };

  return (
    <div className="navbar">
      {/* Geolocation Status */}
      <div className="location-info-section" onClick={fetchLocation}>
        ? Geolocation
      </div>
      {/* Logo Section */}
      <div className="logo">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          🌾 AgriLink
        </Link>
      </div>

<<<<<<< HEAD
      {/* Search Bar */}
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search products, farmers, suppliers..." 
          className="search-input"
        />
        <button className="search-btn">🔍</button>
      </div>

      {/* Navigation Icons */}
      <div className="nav-icons">
        {/* Message Icon */}
        <Link to="/chat" className="nav-item icon-link notification-container">
          ?
          {messageCount > 0 && <span className="dot message-dot">{messageCount > 9 ? '9+' : messageCount}</span>}
        </Link>

        {/* Cart Icon */}
        <Link to="/cart" className="nav-item icon-link notification-container">
          ?
          {/* Placeholder for cart item count - to be fetched later */}
          {/* {cartItemCount > 0 && <span className="dot cart-dot">{cartItemCount > 9 ? '9+' : cartItemCount}</span>} */}
        </Link>

        {/* Notifications */}
        <Notification onClick={() => alert('Open notifications')} />

        {/* Delivery Address */}
        <div className="delivery-info" onClick={() => alert('Open location modal')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <div className="delivery-text">
            <span className="delivery-label">Deliver to</span>
            <span className="delivery-location">Dar es Salaam</span>
          </div>
        </div>

        {/* Profile */}
=======
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search products, farmers, suppliers..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>?</button>
      </div>

      {/* Menu navigation */}
      <div className="menu">
        <Link to="/products" className="nav-item">Products</Link>
        <Link to="/farmers" className="nav-item">Farmers</Link>
        <Link to="/supplies" className="nav-item">Region Supplier</Link>

        {/* Message Icon */}
        <Link to="/chat" className="nav-item icon-link notification-container">
          💬
          {messageCount > 0 && <span className="dot message-dot">{messageCount > 9 ? '9+' : messageCount}</span>}
        </Link>

        {/* Cart Icon */}
        <Link to="/cart" className="nav-item icon-link notification-container">
          🛒
          {/* Placeholder for cart item count - to be fetched later */}
          {/* {cartItemCount > 0 && <span className="dot cart-dot">{cartItemCount > 9 ? '9+' : cartItemCount}</span>} */}
        </Link>

        <Notification /> {/* This is for general notifications */}
>>>>>>> a7b1e01a2a6fddc32d7a4eeff7173f25d609b85e
        <Profile />
        <div className="auth-links">
          <Link to="/login" className="nav-item">Login</Link>
          <Link to="/signup" className="nav-item">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Navigation;
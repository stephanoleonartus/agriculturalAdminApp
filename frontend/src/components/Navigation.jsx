import React from "react";
import { Link } from "react-router-dom";
import '../styles/navigation.css';
import Notification from "./Notification";
import Profile from "./Profile";

function Navigation() {
  // Placeholder for message count, to be fetched later
  const messageCount = 0; // Example: replace with actual count from state/context

  return (
    <div className="navbar">
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
        {/* Messages */}
        <Link to="/messages" className="nav-icon">
          <div className="icon-container">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span className="icon-label">Messages</span>
          </div>
        </Link>

        {/* Cart */}
        <Link to="/cart" className="nav-icon">
          <div className="icon-container">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="21" r="1"/>
              <circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57L23 6H6"/>
            </svg>
            <span className="cart-count">3</span>
            <span className="icon-label">Cart</span>
          </div>
        </Link>

        {/* Notifications */}
        <Notification />

        {/* Delivery Address */}
        <div className="delivery-info">
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
      </div>
    </div>
  );
}

export default Navigation;
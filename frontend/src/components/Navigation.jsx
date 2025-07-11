import React from "react";
import { Link } from "react-router-dom";
import '../styles/navigation.css';
import Notification from "./Notification";
import Profile from "./Profile";

function Navigation() {
  return (
    <div className="navbar">
      {/* Logo Section */}
      <div className="logo">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          🌾 AgriLink
        </Link>
      </div>

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
        <Profile />
      </div>
    </div>
  );
}

export default Navigation;
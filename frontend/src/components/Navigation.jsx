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
      {/* Home link on logo */}
      <div className="logo">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          🌾 AgriLink.com
        </Link>
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
        <Profile />
      </div>
    </div>
  );
}

export default Navigation;

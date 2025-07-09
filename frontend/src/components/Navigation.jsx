import React from "react";
import { Link } from "react-router-dom";
import '../styles/navigation.css';
import Notification from "./Notification";
import Profile from "./Profile";

function Navigation() {
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
        <Notification />
        <Profile />
      </div>
    </div>
  );
}

export default Navigation;

import React from "react";
import '../styles/navigation.css'; // Link to CSS
import Notification from "./Notification";

function Navigation() {
  return (
    //  Top Navigation
    <div className="navbar">
      <div className="logo">🌾 AgriLink.com</div>
      <div className="menu">
        <span>Products</span>
        <span>Farmers</span>
        <span>Region Supplies</span>
        <span>Insights</span>
        <Notification />
      </div>
    </div>
  );
}

export default Navigation;

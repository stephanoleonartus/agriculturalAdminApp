import React from 'react';
import '../../styles/dashboard/Header.css';

const Header = ({ sidebarOpen, setSidebarOpen, activeSection, user }) => {
  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'orders', label: 'Orders' },
    { id: 'products', label: 'Products' },
    { id: 'add-product', label: 'Add Product' },
    { id: 'categories', label: 'Categories' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'buyers', label: 'Buyers' },
    { id: 'suppliers', label: 'Suppliers' },
    { id: 'farmers', label: 'Farmers' },
    { id: 'messages', label: 'Messages / Chat' },
    { id: 'analytics', label: 'Analytics / Reports' },
    { id: 'top-selling', label: 'Top Selling Products' },
    { id: 'crop-demand', label: 'Crop Demand Trends' },
    { id: 'transactions', label: 'Transactions / Payments' },
    { id: 'discounts', label: 'Discounts / Offers' },
    { id: 'profiles', label: 'User Profiles' },
    { id: 'settings', label: 'Settings' },
    { id: 'logout', label: 'Logout' }
  ];

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <i className="fas fa-bars"></i>
        </button>
        <div className="header-title">
          <h1>
            {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
          </h1>
          <p>Welcome back, {user?.username}!</p>
        </div>
      </div>
      <div className="header-right">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search products, orders..." />
        </div>
        <button className="notification-btn">
          <i className="fas fa-bell"></i>
          <span className="notification-dot"></span>
        </button>
        <button className="settings-btn">
          <i className="fas fa-cog"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import '../../styles/dashboard/Sidebar.css';

const Sidebar = ({ sidebarOpen, setSidebarOpen, activeSection, setActiveSection, user }) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: 'fas fa-home' },
    { id: 'orders', label: 'Orders', icon: 'fas fa-shopping-cart' },
    { id: 'products', label: 'Products', icon: 'fas fa-box' },
    { id: 'add-product', label: 'Add Product', icon: 'fas fa-plus' },
    { id: 'categories', label: 'Categories', icon: 'fas fa-tag' },
    { id: 'inventory', label: 'Inventory', icon: 'fas fa-boxes' },
    { id: 'buyers', label: 'Buyers', icon: 'fas fa-users' },
    { id: 'suppliers', label: 'Suppliers', icon: 'fas fa-truck' },
    { id: 'farmers', label: 'Farmers', icon: 'fas fa-seedling' },
    { id: 'messages', label: 'Messages / Chat', icon: 'fas fa-comment-dots' },
    { id: 'analytics', label: 'Analytics / Reports', icon: 'fas fa-chart-bar' },
    { id: 'top-selling', label: 'Top Selling Products', icon: 'fas fa-star' },
    { id: 'crop-demand', label: 'Crop Demand Trends', icon: 'fas fa-chart-line' },
    { id: 'transactions', label: 'Transactions / Payments', icon: 'fas fa-credit-card' },
    { id: 'discounts', label: 'Discounts / Offers', icon: 'fas fa-percent' },
    { id: 'profiles', label: 'User Profiles', icon: 'fas fa-user' },
    { id: 'settings', label: 'Settings', icon: 'fas fa-cog' },
    { id: 'logout', label: 'Logout', icon: 'fas fa-sign-out-alt' }
  ];

  return (
    <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">
            {user?.role === 'farmer' ? (
              <i className="fas fa-seedling"></i>
            ) : (
              <i className="fas fa-truck"></i>
            )}
          </div>
          <div className="logo-text">
            <h2>AgriMarket</h2>
            <p>{user?.role} Dashboard</p>
          </div>
        </div>
        <button className="close-btn" onClick={() => setSidebarOpen(false)}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="user-profile">
        <div className="profile-picture">
          {user?.username ? user.username.substring(0, 2).toUpperCase() : 'US'}
        </div>
        <div className="profile-info">
          <p>{user?.username}</p>
          <p>{user?.location}</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveSection(item.id);
              if (window.innerWidth < 1024) setSidebarOpen(false);
            }}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;

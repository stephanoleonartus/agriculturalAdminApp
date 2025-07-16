import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../styles/DashboardLayout.css';

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  return (
    <div className="dashboard-layout">
      <div className="dashboard-sidebar">
        <ul>
          <li><Link to="/dashboard"><i className="fas fa-tachometer-alt"></i>Dashboard</Link></li>
          <li><Link to="/dashboard/orders"><i className="fas fa-shopping-cart"></i>Orders</Link></li>
          <li><Link to="/dashboard/products"><i className="fas fa-box"></i>Products</Link></li>
          <li><Link to="/products/add"><i className="fas fa-plus-square"></i>Add Product</Link></li>
          <li><Link to="/dashboard/categories"><i className="fas fa-tags"></i>Categories</Link></li>
          <li><Link to="/dashboard/inventory"><i className="fas fa-boxes"></i>Inventory</Link></li>
          <li><Link to="/dashboard/buyers"><i className="fas fa-users"></i>Buyers</Link></li>
          <li><Link to="/dashboard/suppliers"><i className="fas fa-truck"></i>Suppliers</Link></li>
          <li><Link to="/dashboard/farmers"><i className="fas fa-leaf"></i>Farmers</Link></li>
          <li><Link to="/dashboard/chat"><i className="fas fa-comments"></i>Messages / Chat</Link></li>
          <li><Link to="/dashboard/analytics"><i className="fas fa-chart-line"></i>Analytics / Reports</Link></li>
          <li><Link to="/dashboard/top-selling"><i className="fas fa-star"></i>Top-Selling Crops</Link></li>
          <li><Link to="/dashboard/crop-demand"><i className="fas fa-chart-bar"></i>Crop Demand Trends</Link></li>
          <li><Link to="/dashboard/transactions"><i className="fas fa-credit-card"></i>Transactions / Payments</Link></li>
          <li><Link to="/dashboard/discounts"><i className="fas fa-percent"></i>Discounts / Offers</Link></li>
          <li><Link to="/profile"><i className="fas fa-user"></i>User Profiles</Link></li>
          <li><Link to="/profile/settings"><i className="fas fa-cog"></i>Settings</Link></li>
          <li><button onClick={handleLogout}><i className="fas fa-sign-out-alt"></i>Logout</button></li>
        </ul>
      </div>
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;

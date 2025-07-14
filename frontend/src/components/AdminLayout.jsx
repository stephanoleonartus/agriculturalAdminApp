import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../styles/AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>AgriLink</h2>
        </div>
        <ul className="sidebar-menu">
          <li>
            <Link to="/admin">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/products">Manage Products</Link>
          </li>
          <li>
            <Link to="/admin/customers">Manage Customers</Link>
          </li>
          <li>
            <Link to="/admin/orders">Manage Orders</Link>
          </li>
          <li>
            <Link to="/admin/analytics">Insights & Analytics</Link>
          </li>
          <li>
            <Link to="/admin/settings">Settings</Link>
          </li>
          <li>
            <Link to="/logout">Logout</Link>
          </li>
        </ul>
      </div>
      <div className="main-content">
        <div className="top-bar">
          <div className="welcome-message">
            Welcome back, [User's Name]!
          </div>
          <div className="profile-section">
            <img src="https://via.placeholder.com/40" alt="User Avatar" />
          </div>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../styles/DashboardLayout.css';

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <div className="dashboard-sidebar">
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/dashboard/products">Products</Link>
          </li>
          <li>
            <Link to="/dashboard/orders">Orders</Link>
          </li>
          <li>
            <Link to="/dashboard/chat">Chat</Link>
          </li>
        </ul>
      </div>
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;

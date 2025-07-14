import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>My Agrilink</h1>
      <div className="dashboard-links">
        <Link to="/admin/products" className="dashboard-link">
          Manage Products
        </Link>
        {/* Add other admin links here */}
      </div>
    </div>
  );
};

export default AdminDashboard;

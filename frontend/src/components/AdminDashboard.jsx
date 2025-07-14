import React from 'react';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="overview-cards">
        <div className="card">
          <h3>Total Products</h3>
          <p>1,250</p>
        </div>
        <div className="card">
          <h3>Total Orders</h3>
          <p>850</p>
        </div>
        <div className="card">
          <h3>Active Customers</h3>
          <p>320</p>
        </div>
        <div className="card">
          <h3>Revenue</h3>
          <p>$12,500</p>
        </div>
      </div>
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <ul>
          <li>Order #1234 placed by John Doe</li>
          <li>New product "Organic Bananas" added</li>
          <li>User Jane Smith registered</li>
        </ul>
      </div>
      <div className="sales-chart">
        <h3>Monthly Sales</h3>
        {/* Add chart component here */}
      </div>
    </div>
  );
};

export default AdminDashboard;

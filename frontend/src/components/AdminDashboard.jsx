import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }

    const fetchStats = async () => {
      try {
        const response = await axios.get('accounts/dashboard-stats/');
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      {user && <h2>Welcome back, {user.first_name}!</h2>}
      <div className="overview-cards">
        <div className="card">
          <h3>Total Products</h3>
          <p>{stats ? stats.total_products : '...'}</p>
        </div>
        <div className="card">
          <h3>Total Orders</h3>
          <p>{stats ? stats.total_orders : '...'}</p>
        </div>
        <div className="card">
          <h3>Active Customers</h3>
          <p>{stats ? stats.active_customers : '...'}</p>
        </div>
        <div className="card">
          <h3>Revenue</h3>
          <p>${stats ? stats.revenue : '...'}</p>
        </div>
      </div>
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <ul>
          {/* Add recent activity here */}
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

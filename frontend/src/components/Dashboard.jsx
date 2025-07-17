import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import '../styles/AccountDetail.css';

import { BarChart3, Users, ShoppingCart, DollarSign, TrendingUp, Package, Bell, Search, Settings } from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('auth/profile/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            <div className="header-left">
              <div className="logo">
                <BarChart3 className="logo-icon" />
              </div>
              <div>
                <h1 className="header-title">Dashboard</h1>
              </div>
            </div>
            
            <div className="header-right">
              <div className="search-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input"
                />
              </div>
              <button className="header-button">
                <Bell className="button-icon" />
              </button>
              <button className="header-button">
                <Settings className="button-icon" />
              </button>
              <div className="avatar">
                <span>{user?.username ? user.username.substring(0, 2).toUpperCase() : 'JD'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h2 className="welcome-title">Welcome back, {user?.username || 'User'}!</h2>
          <p className="welcome-subtitle">Here's what's happening with your business today.</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Total Revenue</p>
                <p className="stat-value">$45,231</p>
                <p className="stat-change positive">+20.1% from last month</p>
              </div>
              <div className="stat-icon green">
                <DollarSign className="icon" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Orders</p>
                <p className="stat-value">1,234</p>
                <p className="stat-change blue">+12.5% from last month</p>
              </div>
              <div className="stat-icon blue">
                <ShoppingCart className="icon" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Customers</p>
                <p className="stat-value">2,456</p>
                <p className="stat-change purple">+8.2% from last month</p>
              </div>
              <div className="stat-icon purple">
                <Users className="icon" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Products</p>
                <p className="stat-value">567</p>
                <p className="stat-change orange">+3.1% from last month</p>
              </div>
              <div className="stat-icon orange">
                <Package className="icon" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="section-grid">
          <div className="section-card">
            <h3 className="section-title">Quick Actions</h3>
            <div className="actions-grid">
              <button className="action-button blue">
                <Package className="action-icon" />
                <span className="action-text">Add Product</span>
              </button>
              <button className="action-button green">
                <ShoppingCart className="action-icon" />
                <span className="action-text">View Orders</span>
              </button>
              <button className="action-button purple">
                <Users className="action-icon" />
                <span className="action-text">Manage Users</span>
              </button>
              <button className="action-button orange">
                <TrendingUp className="action-icon" />
                <span className="action-text">Analytics</span>
              </button>
            </div>
          </div>

          <div className="section-card">
            <h3 className="section-title">Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon green">
                  <ShoppingCart className="activity-icon-svg" />
                </div>
                <div className="activity-content">
                  <p className="activity-title">New order #1234</p>
                  <p className="activity-time">2 minutes ago</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon blue">
                  <Users className="activity-icon-svg" />
                </div>
                <div className="activity-content">
                  <p className="activity-title">New customer registered</p>
                  <p className="activity-time">15 minutes ago</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon purple">
                  <Package className="activity-icon-svg" />
                </div>
                <div className="activity-content">
                  <p className="activity-title">Product "Wireless Headphones" updated</p>
                  <p className="activity-time">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="chart-section">
          <div className="chart-header">
            <h3 className="chart-title">Sales Overview</h3>
            <div className="chart-controls">
              <button className="chart-button active">7 days</button>
              <button className="chart-button">30 days</button>
              <button className="chart-button">90 days</button>
            </div>
          </div>
          <div className="chart-placeholder">
            <div className="chart-content">
              <TrendingUp className="chart-icon" />
              <p className="chart-text">Chart visualization would go here</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
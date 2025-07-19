import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import Card from './Card';
import Widget from './Widget';
import Chart from './Chart';
import '../styles/AccountDetail.css';
import '../styles/Dashboard.css';

import { BarChart3, Users, ShoppingCart, DollarSign, TrendingUp, Package, Bell, Search, Settings, Sprout, Truck, Eye } from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/auth/me/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/v1/analytics/dashboard-stats/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    const fetchChartData = async () => {
      try {
        const response = await axios.get('/v1/analytics/sales/revenue_chart/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setChartData(response.data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchUser();
    fetchDashboardData();
    fetchChartData();
  }, []);

  return (
    <div className="dashboard">
      {/* Header Card */}
      <Card>
        <header className="header">
          <div className="header-container">
            <div className="header-content">
              <div className="header-left">
                <div className="logo">
                  {user?.role === 'farmer' ? <Sprout className="logo-icon" /> : <Truck className="logo-icon" />}
                </div>
                <div>
                  <h1 className="header-title">{user?.role === 'farmer' ? 'Farmer' : 'Supplier'} Dashboard</h1>
                </div>
              </div>
              
              <div className="header-right">
                <div className="search-container">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search products..."
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
                  <span>{user?.username ? user.username.substring(0, 2).toUpperCase() : 'US'}</span>
                </div>
              </div>
            </div>
          </div>
        </header>
      </Card>

      {/* Main Content */}
      <main className="main-content">
        {/* Account Detail Card */}
        <Card title="Account Information">
          <div className="account-detail-container">
            <div className="account-detail">
              <div className="header">
                <div className="profile-photo">
                  <img src={user?.profile_picture || "https://via.placeholder.com/150"} alt="Profile" />
                  <a href="#">Upload Photo</a>
                </div>
                <div className="vertical-line"></div>
                <div className="account-info">
                  <h3>{user?.username} ({user?.role === 'farmer' ? 'Farmer' : 'Supplier'})</h3>
                  <p>Email: {user?.email} <a href="#">Change email address</a></p>
                  <p>Mobile: {user?.phone_number || 'N/A'} <a href="#">Change Mobile number</a></p>
                  <p>Location: {user?.location || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Welcome Card */}
        <Card>
          <div className="welcome-section">
            <h2 className="welcome-title">Welcome back, {user?.username || 'User'}!</h2>
            <p className="welcome-subtitle">
              {user?.role === 'farmer' 
                ? "Manage your crops and connect with buyers today." 
                : "Manage your supply chain and inventory today."}
            </p>
          </div>
        </Card>

        {/* Dashboard Widgets Card */}
        {dashboardData && dashboardData.widgets && (
          <Card title="Overview Metrics">
            <div className="widgets-container">
              <div className="widgets">
                {dashboardData.widgets.map((widget, index) => (
                  <Widget key={index} title={widget.title} value={widget.value} />
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Stats Cards Grid */}
        <div className="stats-grid">
          <Card>
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-label">Total Revenue</p>
                  <p className="stat-value">
                    {dashboardData?.revenue || '$12,450'}
                  </p>
                  <p className="stat-change positive">+18.2% from last month</p>
                </div>
                <div className="stat-icon green">
                  <DollarSign className="icon" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-label">{user?.role === 'farmer' ? 'Crop Orders' : 'Supply Orders'}</p>
                  <p className="stat-value">
                    {dashboardData?.orders || '147'}
                  </p>
                  <p className="stat-change blue">+12.5% from last month</p>
                </div>
                <div className="stat-icon blue">
                  <ShoppingCart className="icon" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-label">{user?.role === 'farmer' ? 'Buyers' : 'Customers'}</p>
                  <p className="stat-value">
                    {dashboardData?.customers || '89'}
                  </p>
                  <p className="stat-change purple">+8.2% from last month</p>
                </div>
                <div className="stat-icon purple">
                  <Users className="icon" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-label">{user?.role === 'farmer' ? 'Active Crops' : 'Products'}</p>
                  <p className="stat-value">
                    {dashboardData?.products || '23'}
                  </p>
                  <p className="stat-change orange">+5.1% from last month</p>
                </div>
                <div className="stat-icon orange">
                  <Package className="icon" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions and Recent Activity Cards */}
        <div className="section-grid">
          <Card title="Quick Actions">
            <div className="actions-grid">
              <button className="action-button blue">
                <Package className="action-icon" />
                <span className="action-text">
                  {user?.role === 'farmer' ? 'Add Crop' : 'Add Product'}
                </span>
              </button>
              <button className="action-button green">
                <ShoppingCart className="action-icon" />
                <span className="action-text">View Orders</span>
              </button>
              <button className="action-button purple">
                <Eye className="action-icon" />
                <span className="action-text">View Inventory</span>
              </button>
              <button className="action-button orange">
                <TrendingUp className="action-icon" />
                <span className="action-text">Sales Analytics</span>
              </button>
            </div>
          </Card>

          <Card title="Recent Activity">
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon green">
                  <ShoppingCart className="activity-icon-svg" />
                </div>
                <div className="activity-content">
                  <p className="activity-title">
                    {user?.role === 'farmer' ? 'New crop order #1234' : 'New supply order #1234'}
                  </p>
                  <p className="activity-time">2 minutes ago</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon blue">
                  <Users className="activity-icon-svg" />
                </div>
                <div className="activity-content">
                  <p className="activity-title">
                    {user?.role === 'farmer' ? 'New buyer inquiry' : 'New customer registered'}
                  </p>
                  <p className="activity-time">15 minutes ago</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon purple">
                  <Package className="activity-icon-svg" />
                </div>
                <div className="activity-content">
                  <p className="activity-title">
                    {user?.role === 'farmer' ? 'Tomato harvest updated' : 'Inventory restocked'}
                  </p>
                  <p className="activity-time">1 hour ago</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Chart Card */}
        <Card title="Sales Overview">
          <div className="chart-section">
            <div className="chart-header">
              <h3 className="chart-title">
                {user?.role === 'farmer' ? 'Crop Sales Trends' : 'Supply Sales Trends'}
              </h3>
              <div className="chart-controls">
                <button className="chart-button active">7 days</button>
                <button className="chart-button">30 days</button>
                <button className="chart-button">90 days</button>
              </div>
            </div>
            
            {/* Use Chart component if data is available */}
            {chartData ? (
              <Chart data={chartData} />
            ) : (
              <div className="chart-placeholder">
                <div className="chart-content">
                  <TrendingUp className="chart-icon" />
                  <p className="chart-text">
                    {user?.role === 'farmer' 
                      ? 'Your crop sales visualization will appear here' 
                      : 'Your supply sales visualization will appear here'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
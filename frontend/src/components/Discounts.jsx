import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import Card from './Card';
import Widget from './Widget';
import Chart from './Chart';
import '../styles/AccountDetail.css';
import '../styles/Dashboard.css';

import { 
  BarChart3, Users, ShoppingCart, DollarSign, TrendingUp, Package, 
  Bell, Search, Settings, Sprout, Truck, Eye, ChevronDown, MessageSquare,
  Star, Globe, Calendar, ArrowUpRight, Filter, MoreVertical, Plus
} from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(3);

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
    <div className="alibaba-dashboard">
      {/* Top Header */}
      <header className="top-header">
        <div className="header-container">
          <div className="header-left">
            <div className="logo-section">
              {user?.role === 'farmer' ? 
                <Sprout className="logo-icon" /> : 
                <Truck className="logo-icon" />
              }
              <div className="logo-text">
                <h1>AgriConnect</h1>
                <span className="supplier-badge">
                  {user?.role === 'farmer' ? 'Farmer' : 'Supplier'} Dashboard
                </span>
              </div>
            </div>
          </div>
          
          <div className="header-center">
            <div className="search-bar">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search products, orders, buyers..."
                className="search-input"
              />
              <button className="search-btn">Search</button>
            </div>
          </div>

          <div className="header-right">
            <button className="header-action-btn">
              <MessageSquare className="action-icon" />
              <span className="badge">2</span>
            </button>
            <button className="header-action-btn">
              <Bell className="action-icon" />
              {notifications > 0 && <span className="badge">{notifications}</span>}
            </button>
            <div className="user-menu">
              <div className="user-avatar">
                <img 
                  src={user?.profile_picture || "https://via.placeholder.com/40"} 
                  alt="Profile" 
                />
              </div>
              <div className="user-info">
                <span className="user-name">{user?.username || 'User'}</span>
                <ChevronDown className="dropdown-icon" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        <div className="tabs-container">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button 
            className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button 
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button 
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-dashboard">
        <div className="dashboard-container">
          
          {/* Welcome Banner */}
          <div className="welcome-banner">
            <div className="banner-content">
              <div className="welcome-text">
                <h2>Welcome back, {user?.username || 'User'}!</h2>
                <p>
                  {user?.role === 'farmer' 
                    ? "Manage your agricultural products and connect with global buyers." 
                    : "Expand your business reach with our comprehensive supplier tools."}
                </p>
              </div>
              <div className="banner-actions">
                <button className="primary-btn">
                  <Plus className="btn-icon" />
                  Add Product
                </button>
                <button className="secondary-btn">
                  View Orders
                </button>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="metrics-grid">
            <div className="metric-card revenue">
              <div className="metric-header">
                <div className="metric-icon">
                  <DollarSign className="icon" />
                </div>
                <div className="metric-trend">
                  <ArrowUpRight className="trend-icon positive" />
                  <span className="trend-text">+18.2%</span>
                </div>
              </div>
              <div className="metric-content">
                <h3 className="metric-value">{dashboardData?.revenue || '$12,450'}</h3>
                <p className="metric-label">Total Revenue</p>
                <span className="metric-period">This month</span>
              </div>
            </div>

            <div className="metric-card orders">
              <div className="metric-header">
                <div className="metric-icon">
                  <ShoppingCart className="icon" />
                </div>
                <div className="metric-trend">
                  <ArrowUpRight className="trend-icon positive" />
                  <span className="trend-text">+12.5%</span>
                </div>
              </div>
              <div className="metric-content">
                <h3 className="metric-value">{dashboardData?.orders || '147'}</h3>
                <p className="metric-label">{user?.role === 'farmer' ? 'Crop Orders' : 'Supply Orders'}</p>
                <span className="metric-period">This month</span>
              </div>
            </div>

            <div className="metric-card customers">
              <div className="metric-header">
                <div className="metric-icon">
                  <Users className="icon" />
                </div>
                <div className="metric-trend">
                  <ArrowUpRight className="trend-icon positive" />
                  <span className="trend-text">+8.2%</span>
                </div>
              </div>
              <div className="metric-content">
                <h3 className="metric-value">{dashboardData?.customers || '89'}</h3>
                <p className="metric-label">{user?.role === 'farmer' ? 'Active Buyers' : 'Customers'}</p>
                <span className="metric-period">This month</span>
              </div>
            </div>

            <div className="metric-card products">
              <div className="metric-header">
                <div className="metric-icon">
                  <Package className="icon" />
                </div>
                <div className="metric-trend">
                  <ArrowUpRight className="trend-icon positive" />
                  <span className="trend-text">+5.1%</span>
                </div>
              </div>
              <div className="metric-content">
                <h3 className="metric-value">{dashboardData?.products || '23'}</h3>
                <p className="metric-label">{user?.role === 'farmer' ? 'Active Crops' : 'Products'}</p>
                <span className="metric-period">Listed</span>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="content-grid">
            {/* Quick Actions Panel */}
            <div className="quick-actions-panel">
              <div className="panel-header">
                <h3>Quick Actions</h3>
                <MoreVertical className="more-icon" />
              </div>
              <div className="actions-list">
                <button className="action-item">
                  <div className="action-icon blue">
                    <Package className="icon" />
                  </div>
                  <div className="action-content">
                    <span className="action-title">Add New Product</span>
                    <span className="action-desc">List a new item for sale</span>
                  </div>
                </button>
                <button className="action-item">
                  <div className="action-icon green">
                    <ShoppingCart className="icon" />
                  </div>
                  <div className="action-content">
                    <span className="action-title">Manage Orders</span>
                    <span className="action-desc">View and process orders</span>
                  </div>
                </button>
                <button className="action-item">
                  <div className="action-icon purple">
                    <TrendingUp className="icon" />
                  </div>
                  <div className="action-content">
                    <span className="action-title">View Analytics</span>
                    <span className="action-desc">Check sales performance</span>
                  </div>
                </button>
                <button className="action-item">
                  <div className="action-icon orange">
                    <MessageSquare className="icon" />
                  </div>
                  <div className="action-content">
                    <span className="action-title">Messages</span>
                    <span className="action-desc">Chat with buyers</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="chart-panel">
              <div className="panel-header">
                <h3>Sales Performance</h3>
                <div className="chart-controls">
                  <button className="chart-btn active">7D</button>
                  <button className="chart-btn">30D</button>
                  <button className="chart-btn">90D</button>
                  <button className="filter-btn">
                    <Filter className="filter-icon" />
                  </button>
                </div>
              </div>
              <div className="chart-content">
                {chartData ? (
                  <Chart data={chartData} />
                ) : (
                  <div className="chart-placeholder">
                    <TrendingUp className="placeholder-icon" />
                    <p>Sales data visualization will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity & Profile Summary */}
          <div className="bottom-grid">
            <div className="activity-panel">
              <div className="panel-header">
                <h3>Recent Activity</h3>
                <button className="view-all-btn">View All</button>
              </div>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-avatar">
                    <ShoppingCart className="activity-icon" />
                  </div>
                  <div className="activity-content">
                    <p className="activity-title">New order received</p>
                    <p className="activity-desc">Order #ORD-12345 for Organic Tomatoes</p>
                    <span className="activity-time">2 minutes ago</span>
                  </div>
                  <div className="activity-amount">$245.00</div>
                </div>
                <div className="activity-item">
                  <div className="activity-avatar">
                    <MessageSquare className="activity-icon" />
                  </div>
                  <div className="activity-content">
                    <p className="activity-title">New buyer inquiry</p>
                    <p className="activity-desc">Question about bulk pricing</p>
                    <span className="activity-time">15 minutes ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-avatar">
                    <Package className="activity-icon" />
                  </div>
                  <div className="activity-content">
                    <p className="activity-title">Product updated</p>
                    <p className="activity-desc">Fresh Carrots inventory updated</p>
                    <span className="activity-time">1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-summary">
              <div className="panel-header">
                <h3>Profile Summary</h3>
                <button className="edit-btn">Edit</button>
              </div>
              <div className="profile-content">
                <div className="profile-stats">
                  <div className="stat-item">
                    <Star className="stat-icon" />
                    <div className="stat-info">
                      <span className="stat-value">4.8</span>
                      <span className="stat-label">Rating</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <Globe className="stat-icon" />
                    <div className="stat-info">
                      <span className="stat-value">12</span>
                      <span className="stat-label">Countries</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <Calendar className="stat-icon" />
                    <div className="stat-info">
                      <span className="stat-value">2</span>
                      <span className="stat-label">Years</span>
                    </div>
                  </div>
                </div>
                <div className="profile-info">
                  <div className="info-item">
                    <label>Company</label>
                    <span>{user?.company_name || 'AgriSupply Co.'}</span>
                  </div>
                  <div className="info-item">
                    <label>Location</label>
                    <span>{user?.location || 'Not specified'}</span>
                  </div>
                  <div className="info-item">
                    <label>Specialization</label>
                    <span>{user?.role === 'farmer' ? 'Organic Farming' : 'Agricultural Supplies'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
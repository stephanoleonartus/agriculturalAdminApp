import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import '../styles/Dashboard.css';
import { 
  BarChart3, Users, ShoppingCart, DollarSign, 
  Package, Bell, Search, Settings, 
  Calendar, Truck, Crop, Activity,
  FileText, AlertCircle, CreditCard, PieChart
} from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, statsRes] = await Promise.all([
          axios.get('/auth/me/', {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
          }),
          axios.get('/v1/analytics/dashboard-stats/', {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
          })
        ]);
        
        setUser(userRes.data);
        setDashboardData(statsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Simplified data for demonstration
  const demoData = {
    overview: {
      cards: [
        { title: "Total Products", value: "1,245", icon: <Package />, trend: "+12%", color: "blue" },
        { title: "Active Orders", value: "56", icon: <ShoppingCart />, trend: "+5%", color: "green" },
        { title: "Farmers", value: "128", icon: <Crop />, trend: "+8%", color: "orange" },
      ],
      recentActivities: [
        { title: "New order from Farmer John", time: "10 mins ago", icon: <ShoppingCart /> },
        { title: "Payment received from Agro Ltd", time: "25 mins ago", icon: <CreditCard /> },
        { title: "Inventory low for Fertilizer X", time: "2 hours ago", icon: <AlertCircle /> },
      ]
    },
    inventory: {
      items: [
        { name: "Organic Seeds", stock: "450kg", threshold: "50kg" },
        { name: "Fertilizer A", stock: "1,200kg", threshold: "100kg" },
        { name: "Pesticide B", stock: "800L", threshold: "50L" },
        { name: "Irrigation Parts", stock: "45", threshold: "10" },
      ]
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>FarmConnect Admin</h1>
          <p>Welcome back, {user?.username || 'Admin'}!</p>
        </div>
        <div className="header-right">
          <div className="search-box">
            <Search className="search-icon" />
            <input type="text" placeholder="Search..." />
          </div>
          <button className="notification-btn">
            <Bell />
            <span className="badge">3</span>
          </button>
          <div className="user-profile">
            <div className="avatar">
              {user?.username?.substring(0, 1).toUpperCase() || 'A'}
            </div>
            <span>{user?.username || 'Admin'}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            <Activity /> Overview
          </button>
          <button 
            className={activeTab === 'inventory' ? 'active' : ''}
            onClick={() => setActiveTab('inventory')}
          >
            <Package /> Inventory
          </button>
          <button 
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart /> Orders
          </button>
          <button 
            className={activeTab === 'reports' ? 'active' : ''}
            onClick={() => setActiveTab('reports')}
          >
            <FileText /> Reports
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            {/* Summary Cards */}
            <div className="summary-cards">
              {demoData.overview.cards.map((card, index) => (
                <div key={index} className={`summary-card ${card.color}`}>
                  <div className="card-icon">{card.icon}</div>
                  <div className="card-content">
                    <h3>{card.title}</h3>
                    <p className="value">{card.value}</p>
                    <p className="trend">{card.trend}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
              <div className="stats-card">
                <h3>Recent Activities</h3>
                <div className="activities-list">
                  {demoData.overview.recentActivities.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">{activity.icon}</div>
                      <div className="activity-details">
                        <p>{activity.title}</p>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="stats-card">
                <h3>Sales Overview</h3>
                <div className="time-range-selector">
                  <button 
                    className={timeRange === 'week' ? 'active' : ''}
                    onClick={() => setTimeRange('week')}
                  >
                    Week
                  </button>
                  <button 
                    className={timeRange === 'month' ? 'active' : ''}
                    onClick={() => setTimeRange('month')}
                  >
                    Month
                  </button>
                  <button 
                    className={timeRange === 'year' ? 'active' : ''}
                    onClick={() => setTimeRange('year')}
                  >
                    Year
                  </button>
                </div>
                <div className="chart-placeholder">
                  <PieChart className="chart-icon" />
                  <p>Sales data visualization</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button className="action-btn">
                  <ShoppingCart /> Create Order
                </button>
                <button className="action-btn">
                  <Package /> Add Product
                </button>
                <button className="action-btn">
                  <Users /> Manage Users
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="tab-content">
            <div className="inventory-header">
              <h2>Inventory Management</h2>
              <button className="primary-btn">
                <Package /> Add New Item
              </button>
            </div>
            
            <div className="inventory-grid">
              <div className="inventory-filters">
                <div className="filter-group">
                  <label>Category</label>
                  <select>
                    <option>All Categories</option>
                    <option>Seeds</option>
                    <option>Fertilizers</option>
                    <option>Equipment</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Stock Status</label>
                  <select>
                    <option>All Items</option>
                    <option>Low Stock</option>
                    <option>In Stock</option>
                    <option>Out of Stock</option>
                  </select>
                </div>
                <button className="filter-btn">
                  <Search /> Filter
                </button>
              </div>

              <div className="inventory-list">
                <div className="inventory-list-header">
                  <span>Item Name</span>
                  <span>Current Stock</span>
                  <span>Reorder Level</span>
                  <span>Actions</span>
                </div>
                {demoData.inventory.items.map((item, index) => (
                  <div key={index} className="inventory-item">
                    <span>{item.name}</span>
                    <span className={parseInt(item.stock) < parseInt(item.threshold) * 2 ? 'warning' : ''}>
                      {item.stock}
                    </span>
                    <span>{item.threshold}</span>
                    <div className="item-actions">
                      <button className="edit-btn">Edit</button>
                      <button className="restock-btn">Restock</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="tab-content">
            <h2>Order Management</h2>
            <p>Order management content will go here</p>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="tab-content">
            <h2>Reports & Analytics</h2>
            <p>Reports content will go here</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
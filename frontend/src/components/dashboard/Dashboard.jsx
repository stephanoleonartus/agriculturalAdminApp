import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import StatCard from './StatCard';
import ActivityItem from './ActivityItem';
import QuickActionButton from './QuickActionButton';
import '../../styles/dashboard/Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState({
    username: 'John Farmer',
    email: 'john.farmer@agrimarket.com',
    phone_number: '+255 712 345 678',
    location: 'Arusha, Tanzania',
    role: 'farmer',
    profile_picture: null
  });

  const [dashboardData, setDashboardData] = useState({
    revenue: '$24,580',
    orders: '234',
    customers: '156',
    products: '45',
    widgets: [
      { title: 'Total Sales', value: '$24,580', change: '+12.5%', trend: 'up' },
      { title: 'Active Orders', value: '89', change: '+8.2%', trend: 'up' },
      { title: 'Products Listed', value: '45', change: '+15.3%', trend: 'up' },
      { title: 'Customer Satisfaction', value: '94%', change: '+2.1%', trend: 'up' }
    ]
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  return (
    <div className="dashboard-container">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        user={user}
      />
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeSection={activeSection}
          user={user}
        />
        <main className="dashboard-content">
          <div className="welcome-section">
            <div className="welcome-text">
              <h2>Welcome back, {user?.username}!</h2>
              <p>
                {user?.role === 'farmer'
                  ? "Manage your crops and connect with buyers today."
                  : "Manage your supply chain and inventory today."}
              </p>
              <div className="welcome-stats">
                <div className="stat-item">
                  <span>{dashboardData.products} Active Products</span>
                </div>
                <div className="stat-item">
                  <span>{dashboardData.orders} Total Orders</span>
                </div>
              </div>
            </div>
            <div className="welcome-icon">
              <div className="icon-container">
                {user?.role === 'farmer' ? (
                  <i className="fas fa-seedling"></i>
                ) : (
                  <i className="fas fa-truck"></i>
                )}
              </div>
            </div>
          </div>
          <div className="stats-grid">
            <StatCard
              title="Total Revenue"
              value={dashboardData.revenue}
              change="+18.2%"
              trend="up"
              icon="fas fa-dollar-sign"
              color="emerald"
            />
            <StatCard
              title={user?.role === 'farmer' ? 'Crop Orders' : 'Supply Orders'}
              value={dashboardData.orders}
              change="+12.5%"
              trend="up"
              icon="fas fa-shopping-cart"
              color="blue"
            />
            <StatCard
              title={user?.role === 'farmer' ? 'Buyers' : 'Customers'}
              value={dashboardData.customers}
              change="+8.2%"
              trend="up"
              icon="fas fa-users"
              color="purple"
            />
            <StatCard
              title={user?.role === 'farmer' ? 'Active Crops' : 'Products'}
              value={dashboardData.products}
              change="+5.1%"
              trend="up"
              icon="fas fa-box"
              color="orange"
            />
          </div>
          <div className="actions-activity-grid">
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="actions-grid">
                <QuickActionButton
                  icon="fas fa-plus"
                  label={user?.role === 'farmer' ? 'Add New Crop' : 'Add Product'}
                  color="blue"
                  onClick={() => setActiveSection('add-product')}
                />
                <QuickActionButton
                  icon="fas fa-shopping-cart"
                  label="View Orders"
                  color="green"
                  onClick={() => setActiveSection('orders')}
                />
                <QuickActionButton
                  icon="fas fa-eye"
                  label="Check Inventory"
                  color="purple"
                  onClick={() => setActiveSection('inventory')}
                />
                <QuickActionButton
                  icon="fas fa-chart-bar"
                  label="View Analytics"
                  color="orange"
                  onClick={() => setActiveSection('analytics')}
                />
              </div>
            </div>
            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                <ActivityItem
                  icon="fas fa-shopping-cart"
                  title={user?.role === 'farmer' ? 'New crop order #1234 received' : 'New supply order #1234'}
                  time="2 minutes ago"
                  color="green"
                />
                <ActivityItem
                  icon="fas fa-users"
                  title={user?.role === 'farmer' ? 'New buyer inquiry from Arusha' : 'New customer registered'}
                  time="15 minutes ago"
                  color="blue"
                />
                <ActivityItem
                  icon="fas fa-box"
                  title={user?.role === 'farmer' ? 'Tomato harvest updated' : 'Inventory restocked'}
                  time="1 hour ago"
                  color="purple"
                />
                <ActivityItem
                  icon="fas fa-dollar-sign"
                  title="Payment received - $1,250"
                  time="2 hours ago"
                  color="emerald"
                />
                <ActivityItem
                  icon="fas fa-star"
                  title="5-star review received"
                  time="3 hours ago"
                  color="yellow"
                />
              </div>
            </div>
          </div>
          <div className="performance-overview">
            <div className="performance-header">
              <h3>
                {user?.role === 'farmer' ? 'Crop Sales Performance' : 'Supply Performance'}
              </h3>
              <div className="performance-actions">
                <button>7 days</button>
                <button>30 days</button>
                <button>90 days</button>
              </div>
            </div>
            <div className="chart-placeholder">
              <div className="chart-content">
                <i className="fas fa-chart-line"></i>
                <p>
                  {user?.role === 'farmer'
                    ? 'Your crop sales visualization will appear here'
                    : 'Your supply sales visualization will appear here'}
                </p>
                <button>Generate Report</button>
              </div>
            </div>
          </div>
          <div className="market-insights">
            <div className="insight-card">
              <div className="insight-header">
                <h4>Market Trends</h4>
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="insight-list">
                <div className="insight-item">
                  <span>Tomatoes</span>
                  <span>+15%</span>
                </div>
                <div className="insight-item">
                  <span>Maize</span>
                  <span>+8%</span>
                </div>
                <div className="insight-item">
                  <span>Onions</span>
                  <span>-3%</span>
                </div>
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-header">
                <h4>Top Products</h4>
                <i className="fas fa-star"></i>
              </div>
              <div className="insight-list">
                <div className="insight-item">
                  <span>Fresh Tomatoes</span>
                  <span>234 sold</span>
                </div>
                <div className="insight-item">
                  <span>Organic Maize</span>
                  <span>189 sold</span>
                </div>
                <div className="insight-item">
                  <span>Sweet Potatoes</span>
                  <span>156 sold</span>
                </div>
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-header">
                <h4>Notifications</h4>
                <i className="fas fa-bell"></i>
              </div>
              <div className="notification-list">
                <div className="notification-item blue">
                  <p>Weather Alert</p>
                  <p>Rain expected tomorrow</p>
                </div>
                <div className="notification-item green">
                  <p>Price Update</p>
                  <p>Tomato prices increased</p>
                </div>
                <div className="notification-item orange">
                  <p>Stock Alert</p>
                  <p>Low inventory warning</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

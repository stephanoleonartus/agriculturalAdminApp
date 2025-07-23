import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import '../styles/Dashboard.css';
import { 
  BarChart3, Users, ShoppingCart, DollarSign, 
  Package, Bell, Search, Settings, 
  Calendar, Truck, Crop, Activity,
  FileText, AlertCircle, CreditCard, PieChart
} from 'lucide-react';
import CreateOrderModal from './CreateOrderModal';
import AddProductModal from './AddProductModal';
import ManageUsersModal from './ManageUsersModal';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('week');
  const [isCreateOrderModalOpen, setCreateOrderModalOpen] = useState(false);
  const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
  const [isManageUsersModalOpen, setManageUsersModalOpen] = useState(false);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, statsRes, productsRes] = await Promise.all([
          axios.get('/auth/me/', {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
          }),
          axios.get('/analytics/dashboard-stats/', {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
          }),
          axios.get('/products/farmer/products/', {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
          })
        ]);
        
        setUser(userRes.data);
        setDashboardData(statsRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
            {dashboardData ? (
              <div className="summary-cards">
                <div className="summary-card blue">
                  <div className="card-icon"><Package /></div>
                  <div className="card-content">
                    <h3>Total Products</h3>
                    <p className="value">{dashboardData.total_products}</p>
                  </div>
                </div>
                <div className="summary-card green">
                  <div className="card-icon"><ShoppingCart /></div>
                  <div className="card-content">
                    <h3>Active Orders</h3>
                    <p className="value">{dashboardData.active_orders}</p>
                  </div>
                </div>
                <div className="summary-card orange">
                  <div className="card-icon"><Crop /></div>
                  <div className="card-content">
                    <h3>Farmers</h3>
                    <p className="value">{dashboardData.total_farmers}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p>Loading dashboard data...</p>
            )}

            {/* Quick Stats */}
            <div className="quick-stats">
              <div className="stats-card">
                <h3>Recent Activities</h3>
                <div className="activities-list">
                  {/* This will be implemented later */}
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
                <button className="action-btn" onClick={() => setCreateOrderModalOpen(true)}>
                  <ShoppingCart /> Create Order
                </button>
                <button className="action-btn" onClick={() => setAddProductModalOpen(true)}>
                  <Package /> Add Product
                </button>
                <button className="action-btn" onClick={() => setManageUsersModalOpen(true)}>
                  <Users /> Manage Users
                </button>
              </div>
            </div>
          </div>
        )}

        {isCreateOrderModalOpen && <CreateOrderModal closeModal={() => setCreateOrderModalOpen(false)} />}
        {isAddProductModalOpen && <AddProductModal closeModal={() => setAddProductModalOpen(false)} />}
        {isManageUsersModalOpen && <ManageUsersModal closeModal={() => setManageUsersModalOpen(false)} />}

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
                {products.length > 0 ? (
                  products.map((product) => (
                    <div key={product.id} className="inventory-item">
                      <span>{product.name}</span>
                      <span className={product.stock < product.reorder_level ? 'warning' : ''}>
                        {product.stock}
                      </span>
                      <span>{product.reorder_level}</span>
                      <div className="item-actions">
                        <button className="edit-btn">Edit</button>
                        <button className="restock-btn">Restock</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No products found.</p>
                )}
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

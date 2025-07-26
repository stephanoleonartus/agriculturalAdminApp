import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import '../styles/Dashboard.css';
import {
  BarChart3, Users, ShoppingCart, DollarSign,
  Package, Bell, Search, Settings,
  Calendar, Truck, Crop, Activity,
  FileText, AlertCircle, CreditCard, PieChart
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import CreateOrderModal from './CreateOrderModal';
import ProductForm from './ProductForm';
import DeleteProductModal from './DeleteProductModal';
import OrderDetailsModal from './OrderDetailsModal';
import ManageUsersModal from './ManageUsersModal';
import Notification from './Notification';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const fetchData = async (setUser, setDashboardData, setProducts, setOrders) => {
  try {
    const [userRes, statsRes, productsRes, ordersRes] = await Promise.all([
      axios.get('/auth/me/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      }),
      axios.get('/analytics/dashboard-stats/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      }),
      axios.get('/products/farmer/products/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      }),
      axios.get('/orders/mine/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      })
    ]);

    setUser(userRes.data);
    setDashboardData(statsRes.data);
    setProducts(productsRes.data);
    setOrders(ordersRes.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const FarmerDashboard = () => {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('week');
  const [isCreateOrderModalOpen, setCreateOrderModalOpen] = useState(false);
  const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setEditProductModalOpen] = useState(false);
  const [isDeleteProductModalOpen, setDeleteProductModalOpen] = useState(false);
  const [isManageUsersModalOpen, setManageUsersModalOpen] = useState(false);
  const [isOrderDetailsModalOpen, setOrderDetailsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchData(setUser, setDashboardData, setProducts, setOrders);
  }, []);

  const getChartData = () => {
    const labels = [];
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      labels.push(date.toLocaleDateString());
      const ordersOnDate = orders.filter(order => new Date(order.created_at).toDateString() === date.toDateString());
      data.push(ordersOnDate.length);
    }
    return {
      labels,
      datasets: [
        {
          label: 'Orders',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };
  };

  const chartData = getChartData();

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Orders Report', 20, 10);
    doc.autoTable({
      head: [['Order ID', 'Buyer', 'Total Amount', 'Status']],
      body: orders.map(order => [order.order_id, order.buyer.username, `$${order.total_amount}`, order.status]),
    });
    doc.save('orders-report.pdf');
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Farmer Dashboard</h1>
          <p>Welcome back, {user?.username || 'Farmer'}!</p>
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
              {user?.username?.substring(0, 1).toUpperCase() || 'F'}
            </div>
            <span>{user?.username || 'Farmer'}</span>
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
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            <Package /> My Products
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
          <button
            className={activeTab === 'buyers' ? 'active' : ''}
            onClick={() => setActiveTab('buyers')}
          >
            <Users /> Buyers
          </button>
          <button
            className={activeTab === 'notifications' ? 'active' : ''}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell /> Notifications
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
                  <div className="card-icon"><Users /></div>
                  <div className="card-content">
                    <h3>Total Customers</h3>
                    <p className="value">{dashboardData.total_buyers}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p>Loading dashboard data...</p>
            )}
            <div className="chart-container">
              <h3>Sales Overview</h3>
              <Bar data={chartData} />
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="tab-content">
            <div className="inventory-header">
              <h2>My Products</h2>
              <button className="primary-btn" onClick={() => setAddProductModalOpen(true)}>
                <Package /> Add New Product
              </button>
            </div>

            <div className="inventory-list">
              <div className="inventory-list-header">
                <span>Product Name</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Actions</span>
              </div>
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product.id} className="inventory-item">
                    <span>{product.name}</span>
                    <span>${product.price}</span>
                    <span>{product.quantity}</span>
                    <div className="item-actions">
                      <button className="edit-btn" onClick={() => {
                        setSelectedProduct(product);
                        setEditProductModalOpen(true);
                      }}>Edit</button>
                      <button className="delete-btn" onClick={() => {
                        setSelectedProduct(product);
                        setDeleteProductModalOpen(true);
                      }}>Delete</button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No products found.</p>
              )}
            </div>
          </div>
        )}

        {isAddProductModalOpen && <ProductForm closeModal={() => setAddProductModalOpen(false)} refreshProducts={() => fetchData(setUser, setDashboardData, setProducts, setOrders)} />}
        {isEditProductModalOpen && <ProductForm closeModal={() => setEditProductModalOpen(false)} product={selectedProduct} refreshProducts={() => fetchData(setUser, setDashboardData, setProducts, setOrders)} />}
        {isDeleteProductModalOpen && <DeleteProductModal closeModal={() => setDeleteProductModalOpen(false)} product={selectedProduct} refreshProducts={() => fetchData(setUser, setDashboardData, setProducts, setOrders)} />}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="tab-content">
            <h2>My Orders</h2>
            <div className="inventory-list">
              <div className="inventory-list-header">
                <span>Order ID</span>
                <span>Buyer</span>
                <span>Total Amount</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.order_id} className="inventory-item">
                    <span>{order.order_id}</span>
                    <span>{order.buyer.username}</span>
                    <span>${order.total_amount}</span>
                    <span>{order.status}</span>
                    <div className="item-actions">
                      <button className="view-btn" onClick={() => {
                        setSelectedOrder(order);
                        setOrderDetailsModalOpen(true);
                      }}>View</button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No orders found.</p>
              )}
            </div>
          </div>
        )}

        {isOrderDetailsModalOpen && <OrderDetailsModal closeModal={() => setOrderDetailsModalOpen(false)} order={selectedOrder} />}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="tab-content">
            <h2>Reports & Analytics</h2>
            <button className="primary-btn" onClick={generatePDF}>
              <FileText /> Generate PDF Report
            </button>
          </div>
        )}

        {/* Buyers Tab */}
        {activeTab === 'buyers' && (
          <div className="tab-content">
            <h2>My Buyers</h2>
            <div className="inventory-list">
              <div className="inventory-list-header">
                <span>Buyer Name</span>
                <span>Email</span>
                <span>Phone</span>
              </div>
              {orders.length > 0 ? (
                [...new Map(orders.map(order => [order.buyer.id, order.buyer])).values()].map(buyer => (
                  <div key={buyer.id} className="inventory-item">
                    <span>{buyer.username}</span>
                    <span>{buyer.email}</span>
                    <span>{buyer.phone_number}</span>
                  </div>
                ))
              ) : (
                <p>No buyers found.</p>
              )}
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="tab-content">
            <Notification />
          </div>
        )}
      </main>
    </div>
  );
};

export default FarmerDashboard;

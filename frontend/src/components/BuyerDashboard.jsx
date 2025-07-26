import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import "../styles/UserDashboard.css";

function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get("/analytics/dashboard-stats/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setStats(response.data);
    } catch (error) {
      setError("Failed to fetch stats.");
      console.error("Error fetching stats:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/products/products/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setProducts(response.data.results);
    } catch (error)
      {
          setError("Failed to fetch products.");
          console.error("Error fetching products:", error);
      }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/orders/orders/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setOrders(response.data.results);
    } catch (error) {
      setError("Failed to fetch orders.");
      console.error("Error fetching orders:", error);
    }
  };

  const handleStatusChange = async (type, id, newStatus) => {
    try {
      let endpoint = '';
      if (type === 'orders') {
        endpoint = `/orders/orders/${id}/`;
      } else {
        // The endpoints for updating farmer and product status are not defined in the schema.
        // This is a placeholder for the actual implementation.
        alert(`Updating ${type} status is not yet implemented.`);
        return;
      }
      await axios.patch(endpoint, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      alert(`${type} status updated to ${newStatus}`);
      // Refetch data to show updated status
      if (type === "orders") fetchOrders();
      if (type === "products") fetchProducts();
    } catch (error) {
      alert(`Failed to update ${type} status.`);
      console.error(`Error updating ${type} status:`, error);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );

  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchProducts();
    fetchOrders();
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const response = await axios.get("/accounts/farmers/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setFarmers(response.data.results);
    } catch (error) {
      setError("Failed to fetch farmers.");
      console.error("Error fetching farmers:", error);
    }
  };

  const renderOverview = () => (
    <div className="overview-section">
      <div className="stats-grid">
        <StatCard title="Total Products" value={stats.total_products} icon="🌾" color="blue" />
        <StatCard title="Total Orders" value={stats.total_orders} icon="📦" color="orange" />
      </div>
      <div className="recent-activities">
        <h3>Recent Activities</h3>
        <ul>
          <li>Product "Fresh Apples" added by Asha Komba</li>
          <li>Order #001 completed successfully</li>
        </ul>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="tab-content">
      <h2>Products</h2>
      <div className="inventory-list">
        <div className="inventory-list-header">
          <span>Product Name</span>
          <span>Price</span>
          <span>Farmer</span>
        </div>
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="inventory-item">
              <span>{product.name}</span>
              <span>${product.price}</span>
              <span>{product.farmer.farm_name}</span>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );

  const renderFarmers = () => (
    <div className="tab-content">
      <h2>Farmers</h2>
      <div className="inventory-list">
        <div className="inventory-list-header">
          <span>Farm Name</span>
          <span>Location</span>
        </div>
        {farmers.length > 0 ? (
          farmers.map((farmer) => (
            <div key={farmer.id} className="inventory-item">
              <span>{farmer.farm_name}</span>
              <span>{farmer.location}</span>
            </div>
          ))
        ) : (
          <p>No farmers found.</p>
        )}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="tab-content">
      <h2>My Orders</h2>
      <div className="inventory-list">
        <div className="inventory-list-header">
          <span>Order ID</span>
          <span>Total Amount</span>
          <span>Status</span>
        </div>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.order_id} className="inventory-item">
              <span>{order.order_id}</span>
              <span>${order.total_amount}</span>
              <span>{order.status}</span>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );


  return (
    <div className="user-dashboard">
      <div className="user-dashboard-header">
        <h1>Buyer Dashboard</h1>
      </div>

      <div className="dashboard-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button
          className={activeTab === 'farmers' ? 'active' : ''}
          onClick={() => setActiveTab('farmers')}
        >
          Farmers
        </button>
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          My Orders
        </button>
      </div>

      <div className="user-dashboard-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'farmers' && renderFarmers()}
        {activeTab === 'orders' && renderOrders()}
      </div>
    </div>
  );
}

export default UserDashboard;

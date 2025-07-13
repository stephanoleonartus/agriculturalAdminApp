import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Admin.css";
import AddProductForm from "./AddProductForm";

function Admin() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalFarmers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSuppliers: 0,
  });
  const [farmers, setFarmers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchFarmers();
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/admin/stats/");
      setStats(response.data);
    } catch (error) {
      setError("Failed to fetch stats.");
      console.error("Error fetching stats:", error);
    }
  };

  const fetchFarmers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/admin/farmers/");
      setFarmers(response.data);
    } catch (error) {
      setError("Failed to fetch farmers.");
      console.error("Error fetching farmers:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/admin/products/");
      setProducts(response.data);
    } catch (error) {
      setError("Failed to fetch products.");
      console.error("Error fetching products:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/admin/orders/");
      setOrders(response.data);
    } catch (error) {
      setError("Failed to fetch orders.");
      console.error("Error fetching orders:", error);
    }
  };

  const handleStatusChange = async (type, id, newStatus) => {
    try {
      await axios.patch(`http://localhost:8000/api/admin/${type}/${id}/`, {
        status: newStatus,
      });
      alert(`${type} status updated to ${newStatus}`);
      // Refetch data to show updated status
      if (type === "orders") fetchOrders();
      if (type === "farmers") fetchFarmers();
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

  const renderOverview = () => (
    <div className="overview-section">
      <div className="stats-grid">
        <StatCard title="Total Farmers" value={stats.totalFarmers} icon="👨‍🌾" color="green" />
        <StatCard title="Total Products" value={stats.totalProducts} icon="🌾" color="blue" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon="📦" color="orange" />
        <StatCard title="Total Suppliers" value={stats.totalSuppliers} icon="🏪" color="purple" />
      </div>
      <div className="recent-activities">
        <h3>Recent Activities</h3>
        <ul>
          <li>New farmer John Mwakyusa registered</li>
          <li>Product "Fresh Apples" added by Asha Komba</li>
          <li>Order #001 completed successfully</li>
          <li>New supplier registered in Arusha region</li>
        </ul>
      </div>
    </div>
  );

  const renderFarmers = () => (
    <div className="farmers-management">
      <h3>Farmers Management</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Region</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {farmers.map(farmer => (
              <tr key={farmer.id}>
                <td>{farmer.id}</td>
                <td>{farmer.name}</td>
                <td>{farmer.region}</td>
                <td>
                  <span className={`status ${farmer.status.toLowerCase()}`}>
                    {farmer.status}
                  </span>
                </td>
                <td>{farmer.joinDate}</td>
                <td>
                  <button className="btn-edit">Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete('farmers', farmer.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="products-management">
      <h3>Products Management</h3>
      <AddProductForm onProductAdded={handleProductAdded} />
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Price (Tzs)</th>
              <th>Farmer</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.farmer}</td>
                <td>
                  <span className={`status ${product.status.toLowerCase()}`}>
                    {product.status}
                  </span>
                </td>
                <td>
                  <button className="btn-edit">Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete('products', product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const handleProductAdded = (newProduct) => {
    setProducts([...products, newProduct]);
    fetchProducts();
  };

  const handleDelete = async (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        await axios.delete(`http://localhost:8000/api/admin/${type}/${id}/`);
        alert(`${type} deleted successfully.`);
        if (type === 'farmers') fetchFarmers();
        if (type === 'products') fetchProducts();
        if (type === 'orders') fetchOrders();
      } catch (error) {
        alert(`Failed to delete ${type}.`);
        console.error(`Error deleting ${type}:`, error);
      }
    }
  };

  const renderOrders = () => (
    <div className="orders-management">
      <h3>Orders Management</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Amount (Tzs)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.product}</td>
                <td>{order.amount}</td>
                <td>
                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusChange('orders', order.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button className="btn-view">View</button>
                  <button className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🎛️ Admin Dashboard</h1>
        <div className="admin-actions">
          <button className="btn-primary">Generate Report</button>
          <button className="btn-secondary">Settings</button>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={activeTab === "overview" ? "tab active" : "tab"}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button 
          className={activeTab === "farmers" ? "tab active" : "tab"}
          onClick={() => setActiveTab("farmers")}
        >
          Farmers
        </button>
        <button 
          className={activeTab === "products" ? "tab active" : "tab"}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        <button 
          className={activeTab === "orders" ? "tab active" : "tab"}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "overview" && renderOverview()}
        {activeTab === "farmers" && renderFarmers()}
        {activeTab === "products" && renderProducts()}
        {activeTab === "orders" && renderOrders()}
      </div>
    </div>
  );
}

export default Admin;
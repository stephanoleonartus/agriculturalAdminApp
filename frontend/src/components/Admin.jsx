import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Admin.css";

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


  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🎛️ Admin Dashboard</h1>
        <div className="admin-actions">
          <button className="btn-primary">Generate Report</button>
          <button className="btn-secondary">Settings</button>
        </div>
      </div>

      <div className="admin-content">
        {renderOverview()}
      </div>
    </div>
  );
}

export default Admin;
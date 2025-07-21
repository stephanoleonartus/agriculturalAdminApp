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
      const response = await axios.get("/v1/analytics/dashboard-stats/", {
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
      const response = await axios.get("/v1/orders/orders/", {
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
        endpoint = `/v1/orders/orders/${id}/`;
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


  return (
    <div className="user-dashboard">
      <div className="user-dashboard-header">
        <h1>🎛️ User Dashboard</h1>
        <div className="user-dashboard-actions">
          <button className="btn-primary">Generate Report</button>
          <button className="btn-secondary">Settings</button>
        </div>
      </div>

      <div className="user-dashboard-content">
        {renderOverview()}
      </div>
    </div>
  );
}

export default UserDashboard;
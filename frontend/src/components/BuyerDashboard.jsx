import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import "../styles/UserDashboard.css";
import OrderTracking from "./OrderTracking";
import OrderDetailsModal from "./OrderDetailsModal";
import OrderDetailsModal from "./OrderDetailsModal";

function UserDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

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



  const renderOrders = () => (
    <div className="tab-content">
      <h2>My Orders</h2>
      <div className="inventory-list">
        <div className="inventory-list-header">
          <span>Order ID</span>
          <span>Total Amount</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.order_id} className="inventory-item">
              <span>{order.order_id}</span>
              <span>${order.total_amount}</span>
              <span>{order.status}</span>
              <span>
                <button onClick={() => setSelectedOrder(order)}>View Details</button>
              </span>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdate={fetchOrders}
        />
      )}
    </div>
  );


  return (
    <div className="user-dashboard">
      <div className="user-dashboard-header">
        <h1>Buyer Dashboard</h1>
      </div>

      <div className="dashboard-tabs">
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          My Orders
        </button>
        <button
          className={activeTab === 'wishlist' ? 'active' : ''}
          onClick={() => setActiveTab('wishlist')}
        >
          Wishlist
        </button>
        <button
          className={activeTab === 'pricing' ? 'active' : ''}
          onClick={() => setActiveTab('pricing')}
        >
          Pricing & Payments
        </button>
        <button
          className={activeTab === 'chat' ? 'active' : ''}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
        <button
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      <div className="user-dashboard-content">
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'wishlist' && <Wishlist />}
        {activeTab === 'pricing' && <PricingAndPayments />}
        {activeTab === 'chat' && <Chat />}
        {activeTab === 'settings' && <Settings />}
      </div>
    </div>
  );
}

export default UserDashboard;

import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import "../styles/UserDashboard.css";
import OrderTracking from "./OrderTracking";
import OrderDetailsModal from "./OrderDetailsModal";
import Wishlist from "./Wishlist";
import PricingAndPayments from "./PricingAndPayments";
import Chat from "./Chat";
import Settings from "./Settings";

function UserDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/auth/buyer/dashboard/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        const data = response.data;
        setUser(data);
        setOrders(data.orders);
      } catch (error) {
        setError("Failed to fetch data.");
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/orders/mine/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setOrders(response.data);
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
    } catch (error) {
      alert(`Failed to update ${type} status.`);
      console.error(`Error updating ${type} status:`, error);
    }
  };




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

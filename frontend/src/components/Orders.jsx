import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import '../styles/Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/v1/orders/orders/');
        setOrders(response.data.results);
        if (response.data.results.length === 0) {
          setError('You have no orders.');
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('You must be logged in to view your orders.');
        } else {
          setError('There was an error fetching your orders.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading your orders...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="orders-page">
      <h3>My Orders</h3>
      {orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <span>Order ID: {order.id}</span>
                <span>Status: {order.status}</span>
              </div>
              <div className="order-card-body">
                <p>Product: {order.product.name}</p>
                <p>Quantity: {order.quantity}</p>
                <p>Total Price: {order.total_price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

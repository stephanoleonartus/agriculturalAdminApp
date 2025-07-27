import React from 'react';
import OrderTracking from './OrderTracking';
import '../styles/Modal.css';
import axios from '../api/axios';

const OrderDetailsModal = ({ order, onClose, onOrderUpdate }) => {
  if (!order) {
    return null;
  }

  const handleCancelOrder = async () => {
    try {
      await axios.patch(`/orders/orders/${order.id}/`, { status: 'cancelled' }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      onOrderUpdate();
      onClose();
    } catch (error) {
      alert('Failed to cancel order.');
      console.error('Error cancelling order:', error);
    }
  };

  const handleModifyOrder = () => {
    // Implement modification logic here
    alert('Modify order functionality not implemented yet.');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h3>Order Details</h3>
        <div className="order-details">
          <p><strong>Order ID:</strong> {order.order_id}</p>
          <p><strong>Total Amount:</strong> ${order.total_amount}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
          <p><strong>Delivery Schedule:</strong> {order.delivery_schedule ? new Date(order.delivery_schedule).toLocaleDateString() : 'Not scheduled'}</p>
          <p><strong>Shipping Address:</strong> {order.shipping_address}</p>
        </div>
        <OrderTracking order={order} />
        <div className="modal-actions">
          <button
            onClick={handleCancelOrder}
            disabled={order.status !== 'pending'}
          >
            Cancel Order
          </button>
          <button
            onClick={handleModifyOrder}
            disabled={order.status !== 'pending'}
          >
            Modify Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;

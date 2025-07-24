import React from 'react';
import '../styles/Modal.css';

const OrderDetailsModal = ({ closeModal, order }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Order Details</h2>
                <div className="order-details">
                    <p><strong>Order ID:</strong> {order.order_id}</p>
                    <p><strong>Buyer:</strong> {order.buyer.username}</p>
                    <p><strong>Total Amount:</strong> ${order.total_amount}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Shipping Address:</strong> {order.shipping_address}</p>
                    <p><strong>Billing Address:</strong> {order.billing_address}</p>
                    <h3>Items</h3>
                    <ul>
                        {order.items.map(item => (
                            <li key={item.id}>
                                {item.product.name} - {item.quantity} x ${item.price}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="modal-actions">
                    <button type="button" onClick={closeModal}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;

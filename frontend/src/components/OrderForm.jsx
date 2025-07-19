import React, { useState } from 'react';
import axios from '../api/axios';

const OrderForm = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    quantity: 1,
    shipping_address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/orders/orders/', {
        product_id: product.id,
        quantity: formData.quantity,
        shipping_address: formData.shipping_address,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      alert('Order placed successfully!');
      onClose();
    } catch (err) {
      console.error('Error placing order:', err);
      setError('There was an error placing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}
      <div className="form-group">
        <label htmlFor="quantity">Quantity</label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="1"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="shipping_address">Shipping Address</label>
        <textarea
          id="shipping_address"
          name="shipping_address"
          value={formData.shipping_address}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
    </form>
  );
};

export default OrderForm;

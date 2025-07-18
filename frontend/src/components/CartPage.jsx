import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import '../styles/CartPage.css';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Please log in to see your cart.');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get('/api/products/cart/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart(response.data);
      } catch (err) {
        setError('There was an error fetching your cart.');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      const response = await axios.patch(`/api/products/cart/${cart.id}/`, { items: [{ id: itemId, quantity }] }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setCart(response.data);
    } catch (err) {
      console.error('Error updating cart item:', err);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`/api/products/cart/items/${itemId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      const newCart = { ...cart };
      newCart.items = newCart.items.filter(item => item.id !== itemId);
      setCart(newCart);
    } catch (err) {
      console.error('Error removing cart item:', err);
    }
  };

  if (loading) {
    return <div>Loading your cart...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    try {
      await axios.post('/api/v1/orders/orders/', { cart_id: cart.id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      alert('Order placed successfully!');
      const response = await axios.get('/api/products/cart/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setCart(response.data);
    } catch (err) {
      console.error('Error placing order:', err);
      alert('There was an error placing the order.');
    }
  };

  return (
    <div className="cart-page">
      <h2>Your Shopping Cart</h2>
      <div className="cart-container">
        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <img src={item.product.images.find(img => img.is_primary)?.image || 'https://via.placeholder.com/150'} alt={item.product.name} />
              </div>
              <div className="item-details">
                <h3>{item.product.name}</h3>
                <p>Price: ${item.product.price}</p>
                <div className="item-quantity">
                  <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
              </div>
              <div className="item-actions">
                <p>Total: ${item.total_price}</p>
                <button onClick={() => handleRemoveItem(item.id)} className="btn-remove">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h3>Cart Summary</h3>
          <p>Total Items: {cart.total_items}</p>
          <p>Total Price: ${cart.total_price}</p>
          <button onClick={handlePlaceOrder} className="btn-checkout">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

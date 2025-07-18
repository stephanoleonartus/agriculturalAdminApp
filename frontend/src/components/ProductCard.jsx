import React from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import '../styles/ProductCard.css';

const ProductCard = ({ product, onDelete }) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const isOwner = user && user.id === product.owner?.id;

  const handleAddToCart = async () => {
    try {
      await axios.post('/api/products/cart/add_item/', {
        product_id: product.id,
        quantity: 1
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      alert(`${product.name} added to cart!`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add to cart. Please try again.');
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await axios.post('/api/products/wishlist/toggle/', {
        product_id: product.id
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      alert(`${product.name} added to wishlist!`);
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      alert('Failed to add to wishlist. Please try again.');
    }
  };

  return (
    <div className="product-card">
      {/* ... rest of your JSX ... */}
    </div>
  );
};

export default ProductCard;
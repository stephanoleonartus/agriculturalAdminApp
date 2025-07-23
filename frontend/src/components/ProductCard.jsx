import React from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import '../styles/ProductCard.css';

const ProductCard = ({ product, onDelete }) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const isOwner = user && user.id === product.owner?.id;

  const handleOrder = async () => {
    try {
      await axios.post('/orders/create_from_product/', {
        product_id: product.id,
        quantity: 1
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      alert(`Order for ${product.name} has been placed!`);
    } catch (err) {
      console.error('Error creating order:', err);
      alert('Failed to place order. Please try again.');
    }
  };

  const handleAddToCart = async () => {
    try {
      await axios.post('/products/cart/add_item/', {
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
      await axios.post('/products/wishlist/toggle/', {
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
      <Link to={`/products/${product.id}`}>
        <img src={product.image} alt={product.name} className="product-image" />
        <h3>{product.name}</h3>
        <p className="price">TZS {product.price}</p>
      </Link>
      <div className="product-actions">
        <button onClick={handleOrder} className="btn-order">Click Order</button>
        <button onClick={handleAddToCart} className="btn-add-to-cart">Add to Cart</button>
        <button onClick={handleAddToWishlist} className="btn-add-to-wishlist">❤️</button>
        {isOwner && (
          <>
            <Link to={`/products/edit/${product.id}`} className="btn-edit">Edit</Link>
            <button onClick={() => onDelete(product.id)} className="btn-delete">Delete</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

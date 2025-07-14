import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import ProductCard from './ProductCard';
import '../styles/product.css';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please log in to see your wishlist.');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get('wishlist/');
        setWishlist(response.data.results);
      } catch (err) {
        setError('There was an error fetching your wishlist.');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await axios.delete(`wishlist/${productId}/`);
      setWishlist(wishlist.filter((item) => item.product.id !== productId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  if (loading) {
    return <div>Loading your wishlist...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (wishlist.length === 0) {
    return (
      <div>
        <h3>My Wishlist</h3>
        <p>Your wishlist is empty.</p>
      </div>
    );
  }

  return (
    <div>
      <h3>My Wishlist</h3>
      <div className="products-grid">
        {wishlist.map((item) => (
          <ProductCard key={item.id} product={item.product} onDelete={() => handleRemoveFromWishlist(item.product.id)} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;

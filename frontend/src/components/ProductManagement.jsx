import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import ProductCard from './ProductCard';
import '../styles/product.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      fetchProducts(parsedUser.id);
    }
  }, []);

  const fetchProducts = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(`products/?farmer__id=${userId}`);
      setProducts(response.data.results || []);
    } catch (err) {
      setError('There was an error fetching your products.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`products/${productId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setProducts(products.filter((p) => p.id !== productId));
      } catch (err) {
        setError('There was an error deleting the product.');
      }
    }
  };

  if (loading) {
    return <div>Loading your products...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h2>Your Products</h2>
        <Link to="/products/add" className="add-product-btn">
          Add Product
        </Link>
      </div>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;

import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from '../api/axios';
import ProductCard from './ProductCard';
import SearchBar from './SearchBar';
import '../styles/product.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`products/${location.search}`);
        setProducts(response.data.results || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        if (err.response) {
          console.error("Error data:", err.response.data);
          console.error("Error status:", err.response.status);
          console.error("Error headers:", err.response.headers);
        } else if (err.request) {
          console.error("Error request:", err.request);
        } else {
          console.error('Error', err.message);
        }
        setError('There was an error fetching the products.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('products/categories/');
        setCategories(response.data.results);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [location.search]);

  const handleSearch = (searchTerm) => {
    const params = new URLSearchParams(location.search);
    params.set('search', searchTerm);
    window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
    // This will trigger the useEffect hook to refetch the products
    const popStateEvent = new PopStateEvent('popstate');
    dispatchEvent(popStateEvent);
  };

  const handleCategoryFilter = (categoryId) => {
    const params = new URLSearchParams(location.search);
    params.set('category__id', categoryId);
    window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
    // This will trigger the useEffect hook to refetch the products
    const popStateEvent = new PopStateEvent('popstate');
    dispatchEvent(popStateEvent);
  };

  const handleDelete = async (productId) => {
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
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="products-page">
      <SearchBar onSearch={handleSearch} />
      <div className="category-filters">
        <h3>Categories</h3>
        <ul>
          {categories.map((category) => (
            <li key={category.id} onClick={() => handleCategoryFilter(category.id)}>
              {category.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="products-header">
        <h2>Our Products</h2>
      </div>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default Products;

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../api/axios';
import ProductCard from './ProductCard';
import SearchBar from './SearchBar';
import '../styles/product.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/products/${location.search}`);
        setProducts(response.data.results);
      } catch (err) {
        console.error(err);
        setError('There was an error fetching the products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  const handleSearch = (searchTerm) => {
    const params = new URLSearchParams(location.search);
    params.set('search', searchTerm);
    window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
    // This will trigger the useEffect hook to refetch the products
    const popStateEvent = new PopStateEvent('popstate');
    dispatchEvent(popStateEvent);
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
      <h2>Our Products</h2>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;

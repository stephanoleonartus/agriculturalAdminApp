import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../api/axios';
import ProductCard from './ProductCard';
import SearchBar from './SearchBar';
import '../styles/product.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`products/${location.search}`);
        setProducts(response.data.results || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError('There was an error fetching the products.');
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

    const fetchRegions = async () => {
      try {
        const response = await axios.get('accounts/regions/');
        setRegions(response.data);
      } catch (err) {
        console.error('Error fetching regions:', err);
      }
    };

    fetchProducts();
    fetchCategories();
    fetchRegions();
  }, [location.search]);

  const handleFilterChange = (filterType, value) => {
    const params = new URLSearchParams(location.search);
    params.set(filterType, value);
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
      <SearchBar onSearch={(searchTerm) => handleFilterChange('search', searchTerm)} />
      <div className="filters">
        <div className="category-filters">
          <h3>Categories</h3>
          <select onChange={(e) => handleFilterChange('category', e.target.value)}>
            <option value="">All</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="region-filters">
          <h3>Regions</h3>
          <select onChange={(e) => handleFilterChange('region', e.target.value)}>
            <option value="">All</option>
            {regions.map((region) => (
              <option key={region.code} value={region.name}>
                {region.name}
              </option>
            ))}
          </select>
        </div>
        <div className="owner-type-filters">
          <h3>Owner Type</h3>
          <select onChange={(e) => handleFilterChange('owner_type', e.target.value)}>
            <option value="">All</option>
            <option value="farmer">Farmer</option>
            <option value="supplier">Supplier</option>
          </select>
        </div>
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

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import '../styles/product.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryError, setCategoryError] = useState(null);
  // TODO: Add state for pagination

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/products/categories/");
        if (response.data && Array.isArray(response.data.results)) {
          setCategories(response.data.results);
        } else if (Array.isArray(response.data)) { // Non-paginated fallback
          setCategories(response.data);
        }
        setCategoryError(null);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategoryError(err.message || "Failed to fetch categories.");
      }
    };
    
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/api/products/');
        setProducts(response.data.results);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || 'There was an error fetching the products.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="products-page">
      <h2>Our Products</h2>
      {categoryError && (
        <div className="error-message category-error">
          Warning: {categoryError}
        </div>
      )}
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
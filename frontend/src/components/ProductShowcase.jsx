import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import ProductCard from './ProductCard';
import '../styles/ProductShowcase.css';

const ProductShowcase = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products/products/featured/');
        if (response.data && Array.isArray(response.data)) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="product-showcase">
      <h3>Product Showcase</h3>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductShowcase;

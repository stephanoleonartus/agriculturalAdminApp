import React from 'react';
import '../styles/Home.css';
import BusinessCategories from './BusinessCategories';
import ProductShowcase from './ProductShowcase';
import FeaturedSuppliers from './FeaturedSuppliers';
import AllProducts from './AllProducts';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Connecting Farmers, Suppliers, and Buyers</h1>
        <p>Your one-stop platform for agricultural products and services.</p>
      </div>
      <div className="home-grid">
        <div className="grid-item">
          <BusinessCategories />
        </div>
        <div className="grid-item">
          <ProductShowcase />
        </div>
        <div className="grid-item">
          <FeaturedSuppliers />
        </div>
        <div className="grid-item-full-width">
          <AllProducts />
        </div>
      </div>
    </div>
  );
};

export default Home;
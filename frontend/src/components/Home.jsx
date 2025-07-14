import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-buttons">
        <NavLink to="/products" className="home-button" activeClassName="active">
          Products
        </NavLink>
        <NavLink to="/farmers" className="home-button" activeClassName="active">
          Farmers
        </NavLink>
        <NavLink to="/suppliers" className="home-button" activeClassName="active">
          Suppliers
        </NavLink>
      </div>
      <div className="home-search-container">
        <i className="fas fa-search search-icon"></i>
        <input
          type="text"
          placeholder="Search for products, farmers, or suppliers"
          className="home-search-input"
        />
      </div>
    </div>
  );
};

export default Home;
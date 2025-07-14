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
        <input
          type="text"
          placeholder="Search for products, farmers, or suppliers"
          className="home-search-input"
        />
        <button className="search-button">
          Search
        </button>
      </div>
    </div>
  );
};

export default Home;
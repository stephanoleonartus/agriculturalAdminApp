import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsHidden(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
      <div className={`home-search-container ${isHidden ? 'hidden' : ''}`}>
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
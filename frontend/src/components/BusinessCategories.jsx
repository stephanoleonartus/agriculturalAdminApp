import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import '../styles/BusinessCategories.css';

const BusinessCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/products/categories/');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="business-categories">
      <h3>Business Categories</h3>
      <div className="category-grid">
        {categories.map((category, index) => (
          <div className="category-card" key={index}>
            <i className={category.icon || 'fas fa-leaf'}></i>
            <p>{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessCategories;
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import '../styles/CategoryMenu.css';

const CategoryMenu = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('products/categories/');
        setCategories(response.data.results || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="category-menu">
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <Link to={`/products?category=${category.name}`}>{category.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryMenu;

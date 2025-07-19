import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import '../styles/CategoryMenu.css';

const CategoryMenu = () => {
  const [categories, setCategories] = useState([]);
  const menuRef = useRef(null);

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

  const scroll = (scrollOffset) => {
    menuRef.current.scrollLeft += scrollOffset;
  };

  return (
    <div className="category-menu-wrapper">
      <button className="scroll-btn left" onClick={() => scroll(-100)}>
        &lt;
      </button>
      <div className="category-menu" ref={menuRef}>
        <ul className="category-list">
          <li>
            <Link to="/products">All Categories</Link>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <Link to={`/products?category=${category.id}`}>{category.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <button className="scroll-btn right" onClick={() => scroll(100)}>
        &gt;
      </button>
    </div>
  );
};

export default CategoryMenu;

import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/CategoryMenu.css';

const categories = [
  { id: 0, name: 'All Categories' },
  { id: 7, name: 'Spices and Herbs' },
  { id: 8, name: 'Sugar Crops' },
  { id: 9, name: 'Beverage Crops' },
  { id: 10, name: 'Fiber Crops' },
  { id: 11, name: 'Services' },
];

const FarmerNav = () => {
  const menuRef = useRef(null);

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
          {categories.map((category) => (
            <li key={category.id}>
              <Link to={`/farmers?category=${category.name}`}>{category.name}</Link>
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

export default FarmerNav;

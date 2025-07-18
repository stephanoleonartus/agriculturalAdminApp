import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/CategoryMenu.css';

const categories = [
  { id: 0, name: 'All Categories' },
  { id: 1, name: 'Grains' },
  { id: 2, name: 'Legumes/Pulses' },
  { id: 3, name: 'Fruits' },
  { id: 4, name: 'Vegetables' },
  { id: 5, name: 'Root and Tuber Crops' },
  { id: 6, name: 'Oilseeds' },
];

const SupplierNav = () => {
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
              <Link to={`/suppliers?category=${category.name}`}>{category.name}</Link>
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

export default SupplierNav;

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/CategoryMenu.css';

const categories = [
  { id: 1, name: 'Grains' },
  { id: 2, name: 'Legumes/Pulses' },
  { id: 3, name: 'Fruits' },
  { id: 4, name: 'Vegetables' },
  { id: 5, name: 'Root and Tuber Crops' },
  { id: 6, name: 'Oilseeds' },
  { id: 7, name: 'Spices and Herbs' },
  { id: 8, name: 'Sugar Crops' },
  { id: 9, name: 'Beverage Crops' },
  { id: 10, name: 'Fiber Crops' },
  { id: 11, name: 'Services' },
];

const CategoryMenu = () => {
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

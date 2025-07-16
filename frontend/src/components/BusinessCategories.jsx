import React from 'react';
import '../styles/BusinessCategories.css';

const BusinessCategories = () => {
  const categories = [
    { name: 'Fresh Produce', icon: 'fas fa-carrot' },
    { name: 'Dairy Products', icon: 'fas fa-cheese' },
    { name: 'Meat & Poultry', icon: 'fas fa-drumstick-bite' },
    { name: 'Grains & Cereals', icon: 'fas fa-seedling' },
    { name: 'Farm Equipment', icon: 'fas fa-tractor' },
    { name: 'Fertilizers & Pesticides', icon: 'fas fa-leaf' },
  ];

  return (
    <div className="business-categories">
      <h3>Business Categories</h3>
      <div className="category-grid">
        {categories.map((category, index) => (
          <div className="category-card" key={index}>
            <i className={category.icon}></i>
            <p>{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessCategories;

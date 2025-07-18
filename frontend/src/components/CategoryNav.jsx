import React from 'react';
import { Link } from 'react-router-dom';

const CategoryNav = () => {
    return (
        <nav className="category-nav">
            <ul>
                <li><Link to="/products">All Categories</Link></li>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/suppliers">Suppliers</Link></li>
                <li><Link to="/farmers">Farmers</Link></li>
            </ul>
        </nav>
    );
};

export default CategoryNav;

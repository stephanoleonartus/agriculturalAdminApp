import React from 'react';
import { useLocation } from 'react-router-dom';
import CategoryMenu from './CategoryMenu';
import SupplierNav from './SupplierNav';
import FarmerNav from './FarmerNav';

const CategoryNav = () => {
    const location = useLocation();

    const renderNav = () => {
        if (location.pathname.startsWith('/suppliers')) {
            return <SupplierNav />;
        } else if (location.pathname.startsWith('/farmers')) {
            return <FarmerNav />;
        } else {
            return <CategoryMenu />;
        }
    };

    return (
        <nav className="category-nav">
            {renderNav()}
        </nav>
    );
};

export default CategoryNav;

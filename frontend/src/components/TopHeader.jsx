import React from 'react';

const TopHeader = () => {
    return (
        <div className="top-header">
            <div className="company-name">agrilink.com</div>
            <div className="search-bar">
                <input type="text" placeholder="Search for products, suppliers, and more..." />
                <button>Search</button>
            </div>
            <div className="header-actions">
                <div className="action-item">
                    <i className="fas fa-globe"></i>
                    <span>Language</span>
                </div>
                <div className="action-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>Delivery to</span>
                </div>
                <div className="action-item">
                    <i className="fas fa-user"></i>
                    <span>Sign In</span>
                </div>
            </div>
        </div>
    );
};

export default TopHeader;

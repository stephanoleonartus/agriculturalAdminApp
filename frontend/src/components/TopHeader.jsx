import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const TopHeader = () => {
    return (
        <div className="top-header">
            <div className="logo">
                <Link to="/">
                    <img src="/agrilink-logo.png" alt="Agrilink Logo" />
                    <span>Agrilink</span>
                </Link>
            </div>
        </div>
    );
};

export default TopHeader;

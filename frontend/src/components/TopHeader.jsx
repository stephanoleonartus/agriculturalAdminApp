import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import ProfileDropdown from './ProfileDropdown';
import Notification from './Notification';
import CartIcon from './CartIcon';
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
            <SearchBar />
            <div className="user-actions">
                <Notification />
                <CartIcon />
                <ProfileDropdown />
            </div>
        </div>
    );
};

export default TopHeader;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';

const TopHeader = () => {
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }

        const handleAuthChange = () => {
            const userInfo = localStorage.getItem('userInfo');
            setUser(userInfo ? JSON.parse(userInfo) : null);
        };

        window.addEventListener('authChange', handleAuthChange);
        return () => {
            window.removeEventListener('authChange', handleAuthChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.dispatchEvent(new Event('authChange'));
        navigate('/');
    };

    return (
        <div className="top-header">
            <div className="company-name">
                <Link to="/">agrilink.com</Link>
            </div>
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
                {user ? (
                    <div
                        className="action-item profile-menu"
                        onMouseEnter={() => setShowDropdown(true)}
                        onMouseLeave={() => setShowDropdown(false)}
                    >
                        <i className="fas fa-user"></i>
                        <Link to="/profile">Hi, {user.first_name}</Link>
                        {showDropdown && <ProfileDropdown />}
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <div className="action-item">
                        <i className="fas fa-user"></i>
                        <Link to="/login">Sign In</Link>

                        <i className="fas fa-user"></i>
                        <Link to="/auth" className="nav-item create-account-btn">
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopHeader;

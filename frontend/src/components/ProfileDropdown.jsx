import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/ProfileDropdown.css';

const ProfileDropdown = ({ user = {} }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  return (
    <div className="profile-dropdown">
      <div className="profile-dropdown-header">
        <p className="greeting">Hi, {user.first_name}</p>
      </div>
      <div className="profile-dropdown-body">
        <ul>
          <li>
            {user.role === 'farmer' || user.role === 'supplier' ? (
              <a href="/dashboard" target="_blank" rel="noopener noreferrer">My Agrilink</a>
            ) : (
              <Link to="/dashboard">My Agrilink</Link>
            )}
          </li>
          <li>
            <Link to="/profile">Account</Link>
          </li>
          <li>
            <Link to="/profile/orders">My Orders</Link>
          </li>
          <li>
            <Link to="/profile/wishlist">Wishlist</Link>
          </li>
          <li>
            <Link to="/profile/payment-methods">Payment Methods</Link>
          </li>
          <li>
            <Link to="/profile/settings">Settings</Link>
          </li>
          <li>
            <Link to="/profile/rewards">Rewards</Link>
          </li>
          <li>
            <Link to="/profile/help-center">Help Center</Link>
          </li>
        </ul>
      </div>
      <div className="profile-dropdown-footer">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default ProfileDropdown;

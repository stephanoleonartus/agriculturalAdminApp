import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/auth/profile/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setUser(response.data);
        localStorage.setItem('userInfo', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout/', {
        refresh: localStorage.getItem('refreshToken'), // assuming you store the refresh token
      });
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
  };

  return (
    <div className="profile-wrapper" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <div className="profile-trigger">
        <div className="profile-avatar">
          {user?.profile_picture ? (
            <img src={user.profile_picture} alt="User Avatar" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </div>
      </div>

      {open && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <div className="profile-header-info">
              <h3>Hi, {user?.first_name} {user?.last_name}</h3>
              <p className="profile-email">{user?.email}</p>
            </div>
          </div>
          <div className="profile-menu">
            {(user?.user_type === 'admin' || user?.user_type === 'farmer' || user?.user_type === 'supplier') && (
              <Link to="/admin" className="profile-menu-item">
                <span className="menu-icon" role="img" aria-label="dashboard">⚙️</span>
                <span className="menu-label">Admin Dashboard</span>
              </Link>
            )}
            <Link to="/profile/my-profile" className="profile-menu-item">
              <span className="menu-icon" role="img" aria-label="profile">👤</span>
              <span className="menu-label">My Profile</span>
            </Link>
            <Link to="/profile/orders" className="profile-menu-item">
              <span className="menu-icon" role="img" aria-label="orders">📦</span>
              <span className="menu-label">My Orders</span>
            </Link>
            <Link to="/profile/wishlist" className="profile-menu-item">
              <span className="menu-icon" role="img" aria-label="wishlist">❤️</span>
              <span className="menu-label">Wishlist</span>
            </Link>
            <Link to="/profile/payment-methods" className="profile-menu-item">
              <span className="menu-icon" role="img" aria-label="payment">💳</span>
              <span className="menu-label">Payment Methods</span>
            </Link>
            <Link to="/profile/settings" className="profile-menu-item">
              <span className="menu-icon" role="img" aria-label="settings">⚙️</span>
              <span className="menu-label">Settings</span>
            </Link>
          </div>
          <div className="profile-footer">
            <button onClick={handleLogout} className="logout-btn">
              <span className="menu-icon" role="img" aria-label="logout">🚪</span>
              <span className="menu-label">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/auth/profile/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setUser(response.data);
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

  const toggleProfile = () => {
    setOpen(!open);
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-trigger" onClick={toggleProfile}>
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
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`dropdown-arrow ${open ? 'open' : ''}`}
        >
          <polyline points="6,9 12,15 18,9" />
        </svg>
      </div>

      {open && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <h3>{user?.username}</h3>
          </div>
          <div className="profile-menu">
            {(user?.user_type === 'admin' || user?.user_type === 'farmer' || user?.user_type === 'supplier') && (
              <Link to="/admin" className="profile-menu-item">
                <span role="img" aria-label="dashboard">⚙️</span> Admin Dashboard
              </Link>
            )}
            <Link to="/profile/my-profile" className="profile-menu-item">
              <span role="img" aria-label="profile">👤</span> My Profile
            </Link>
            <Link to="/profile/orders" className="profile-menu-item">
              <span role="img" aria-label="orders">📦</span> My Orders
            </Link>
            <Link to="/profile/wishlist" className="profile-menu-item">
              <span role="img" aria-label="wishlist">❤️</span> Wishlist
            </Link>
            <Link to="/profile/payment-methods" className="profile-menu-item">
              <span role="img" aria-label="payment">💳</span> Payment Methods
            </Link>
            <Link to="/profile/settings" className="profile-menu-item">
              <span role="img" aria-label="settings">⚙️</span> Settings
            </Link>
          </div>
          <div className="profile-footer">
            <button onClick={handleLogout} className="logout-btn">
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

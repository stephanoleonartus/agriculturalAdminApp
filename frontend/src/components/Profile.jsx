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
        const response = await axios.get('/api/accounts/profile/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
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
            <Link to="/profile/my-profile" className="profile-menu-item">
              My Profile
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

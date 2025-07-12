import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Outlet } from 'react-router-dom';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/accounts/profile/');
        setUser(response.data);
      } catch (err) {
        setError('Please log in to see your profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading your profile...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-sidebar">
        <h3>My Account</h3>
        <nav>
          <Link to="my-profile">My Profile</Link>
          <Link to="orders">My Orders</Link>
          <Link to="wishlist">Wish List</Link>
          <Link to="payment-methods">Payment Methods</Link>
          <Link to="rewards">Rewards</Link>
          <Link to="settings">Settings</Link>
          <Link to="help-center">Help Center</Link>
          <Link to="/logout">Logout</Link>
        </nav>
      </div>
      <div className="profile-content">
        <Outlet context={{ user }} />
      </div>
    </div>
  );
};

export default ProfilePage;

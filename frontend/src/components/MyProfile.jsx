import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import axios from '../api/axios';
import '../styles/Profile.css';

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      const response = await axios.patch('auth/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setUser(response.data);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('There was an error uploading your profile picture.');
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-sidebar">
        <ul>
          <li>
            <Link to="/profile">My Profile</Link>
          </li>
          <li>
            <Link to="/profile/orders">Orders</Link>
          </li>
          <li>
            <Link to="/profile/wishlist">Wishlist</Link>
          </li>
          <li>
            <Link to="/profile/payment-methods">Payment Methods</Link>
          </li>
          <li>
            <Link to="/profile/rewards">Rewards</Link>
          </li>
          <li>
            <Link to="/profile/settings">Settings</Link>
          </li>
          <li>
            <Link to="/profile/help-center">Help Center</Link>
          </li>
        </ul>
      </div>
      <div className="profile-content">
        <h3>My Profile</h3>
        {user && (
          <div>
            <div className="profile-avatar">
              {user.profile_picture ? (
                <img src={user.profile_picture} alt="User Avatar" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100"
                  height="100"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </div>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>First Name:</strong> {user.first_name}</p>
            <p><strong>Last Name:</strong> {user.last_name}</p>
          </div>
        )}
        <form onSubmit={handleFormSubmit}>
          <input type="file" onChange={handleFileChange} />
          <button type="submit">Upload Picture</button>
        </form>
        <Outlet />
      </div>
    </div>
  );
};

export default MyProfile;

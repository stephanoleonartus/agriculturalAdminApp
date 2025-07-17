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
      const response = await axios.patch('accounts/profile/', formData, {
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
      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-avatar">
            {user && user.profile_picture ? (
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
            <form onSubmit={handleFormSubmit}>
              <input type="file" onChange={handleFileChange} />
              <button type="submit">Upload Picture</button>
            </form>
          </div>
          <div className="profile-info">
            <p><strong>Your member ID:</strong> tz39184899346icxu</p>
            <p><strong>Email:</strong> {user && user.email} <Link to="/change-email">Change email address</Link></p>
            <p><strong>Linked Mobile:</strong> <Link to="/link-mobile">Enter Mobile Number</Link></p>
          </div>
        </div>

        <div className="profile-section">
          <h3>Personal Information</h3>
          <ul>
            <li><Link to="/profile/member-profile">Member profile</Link></li>
            <li><Link to="/profile/upload-photo">Upload my photo</Link></li>
            <li><Link to="/profile/privacy-settings">Privacy settings</Link></li>
            <li><Link to="/profile/email-preferences">Email preferences</Link></li>
            <li><Link to="/profile/tax-information">Tax Information</Link></li>
            <li><Link to="/profile/data-preferences">Data preferences</Link></li>
          </ul>
        </div>

        <div className="profile-section">
          <h3>Account Security</h3>
          <ul>
            <li><Link to="/change-email">Change email address</Link></li>
            <li><Link to="/change-password">Change Password</Link></li>
            <li><Link to="/manage-verification-phones">Manage Verification Phones</Link></li>
            <li><Link to="/manage-connected-accounts">Manage My Connected Accounts</Link></li>
          </ul>
        </div>

        <div className="profile-section">
          <h3>Finance Account</h3>
          <ul>
            <li><Link to="/profile/transactions">My transactions</Link></li>
          </ul>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default MyProfile;

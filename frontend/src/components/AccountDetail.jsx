import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import '../styles/AccountDetail.css';

const AccountDetail = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('auth/profile/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="account-detail-container">
      <div className="account-detail">
        <div className="header">
          <div className="profile-photo">
            <img src={user?.profile_picture || "https://via.placeholder.com/150"} alt="Profile" />
            <a href="#">Upload Photo</a>
          </div>
          <div className="vertical-line"></div>
          <div className="account-info">
            <h3>{user?.username} ({user?.role})</h3>
            <p>Email: {user?.email} <a href="#">Change email address</a></p>
            <p>Mobile: {user?.phone_number || 'N/A'} <a href="#">Change Mobile number</a></p>
          </div>
        </div>
        <div className="body">
          <div className="section">
            <h4>Personal Information</h4>
            <ul>
              <li><a href="#">My profile</a></li>
              <li><a href="#">Member profile</a></li>
              <li><a href="#">Upload my photo</a></li>
              <li><a href="#">Privacy settings</a></li>
              <li><a href="#">Email preferences</a></li>
              <li><a href="#">Tax Information</a></li>
              <li><a href="#">Data preferences</a></li>
            </ul>
          </div>
          <div className="vertical-line"></div>
          <div className="section">
            <h4>Account Security</h4>
            <ul>
              <li><a href="#">Change email address</a></li>
              <li><a href="#">Change Password</a></li>
              <li><a href="#">Manage Verification Phones</a></li>
              <li><a href="#">Manage My Connected Accounts</a></li>
            </ul>
          </div>
          <div className="vertical-line"></div>
          <div className="section">
            <h4>Finance Account</h4>
            <ul>
              <li><a href="#">My transactions</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetail;

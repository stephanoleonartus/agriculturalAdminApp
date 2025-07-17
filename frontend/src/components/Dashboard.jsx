import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import '../styles/AccountDetail.css';

const Dashboard = () => {
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
            <h4>Overview</h4>
            <ul>
              <li><a href="#">Dashboard Home</a></li>
              <li><a href="#">Analytics</a></li>
              <li><a href="#">Reports</a></li>
            </ul>
          </div>
          <div className="vertical-line"></div>
          <div className="section">
            <h4>My Business</h4>
            <ul>
              <li><a href="#">My Products</a></li>
              <li><a href="#">My Orders</a></li>
              <li><a href="#">My Customers</a></li>
            </ul>
          </div>
          <div className="vertical-line"></div>
          <div className="section">
            <h4>Tools</h4>
            <ul>
              <li><a href="#">Marketing</a></li>
              <li><a href="#">Promotions</a></li>
              <li><a href="#">Integrations</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

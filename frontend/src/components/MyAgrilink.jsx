import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import '../styles/AccountDetail.css';

const MyAgrilink = () => {
  const [user, setUser] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('auth/me/', {
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

  const handleEmailChange = async (e) => {
    e.preventDefault();
    try {
      await axios.put('auth/me/', { email: newEmail }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      alert('Email changed successfully');
    } catch (error) {
      console.error('Error changing email:', error);
      alert('Failed to change email');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await axios.put('auth/change-password/', { old_password: oldPassword, new_password: newPassword }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      alert('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password');
    }
  };

  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('profile_picture', profilePhoto);
    try {
      // The endpoint for photo upload is not defined in the schema.
      // This is a placeholder for the actual implementation.
      alert('Photo upload functionality is not yet implemented.');
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo');
    }
  };

  return (
    <div className="account-detail-container">
      <div className="account-detail">
        <div className="header">
          <div className="profile-photo">
            <img src={user?.profile_picture || "https://via.placeholder.com/150"} alt="Profile" />
            <form onSubmit={handlePhotoUpload}>
              <input type="file" onChange={(e) => setProfilePhoto(e.target.files[0])} />
              <button type="submit">Upload Photo</button>
            </form>
          </div>
          <div className="vertical-line"></div>
          <div className="account-info">
            <h3>{user?.username} ({user?.role})</h3>
            <p>Email: {user?.email}</p>
            <form onSubmit={handleEmailChange}>
              <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="New email" />
              <button type="submit">Change email</button>
            </form>
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
              <li>
                <form onSubmit={handlePasswordChange}>
                  <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Old password" />
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" />
                  <button type="submit">Change Password</button>
                </form>
              </li>
              <li><a href="#">Manage Verification Phones</a></li>
              <li><a href="#">Manage My Connected Accounts</a></li>
            </ul>
          </div>
          <div className="vertical-line"></div>
          <div className="section">
            <h4>Finance Account</h4>
            <ul>
              <li><Link to="/orders">My transactions</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAgrilink;

import React from 'react';
import '../styles/ProfilePage.css';

function ProfilePage() {
  return (
    <div className="profile-page-container">
      <h1>My Profile</h1>
      <div className="profile-details">
        <div className="profile-picture">
          <img src="https://via.placeholder.com/150" alt="Profile" />
        </div>
        <div className="profile-info">
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Email:</strong> john.doe@example.com</p>
          <p><strong>Role:</strong> Farmer</p>
          <p><strong>Location:</strong> Dar es Salaam, Tanzania</p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

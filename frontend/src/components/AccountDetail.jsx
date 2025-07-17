import React from 'react';
import '../styles/AccountDetail.css';

const AccountDetail = () => {
  return (
    <div className="account-detail">
      <div className="header">
        <div className="profile-photo">
          <img src="https://via.placeholder.com/150" alt="Profile" />
          <a href="#">Upload Photo</a>
        </div>
        <div className="vertical-line"></div>
        <div className="account-info">
          <h3>User Name (Role)</h3>
          <p>Email: user@example.com <a href="#">Change email address</a></p>
          <p>Mobile: 123-456-7890 <a href="#">Change Mobile number</a></p>
        </div>
      </div>
      <div className="horizontal-line"></div>
      <div className="body">
        <div className="section">
          <h4>Personal Information</h4>
          <div className="horizontal-line"></div>
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
          <div className="horizontal-line"></div>
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
          <div className="horizontal-line"></div>
          <ul>
            <li><a href="#">My transactions</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccountDetail;

import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';

const MyProfile = () => {
  const { user, setUser } = useOutletContext();
  const [file, setFile] = useState(null);

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
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setUser(response.data);
      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('There was an error uploading your profile picture.');
    }
  };

  return (
    <div>
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
    </div>
  );
};

export default MyProfile;

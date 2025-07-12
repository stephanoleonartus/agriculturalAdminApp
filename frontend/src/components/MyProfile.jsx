import React from 'react';
import { useOutletContext } from 'react-router-dom';

const MyProfile = () => {
  const { user } = useOutletContext();

  return (
    <div>
      <h3>My Profile</h3>
      {user && (
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>First Name:</strong> {user.first_name}</p>
          <p><strong>Last Name:</strong> {user.last_name}</p>
        </div>
      )}
    </div>
  );
};

export default MyProfile;

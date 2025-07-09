import React, { useState } from "react";
import "../styles/Profile.css";

function Profile() {
  const [open, setOpen] = useState(false); // 👉 This is state

  const toggleProfile = () => {
    setOpen(!open); // 👉 This is event
  };

  const user = {
    name: "Stephano Siame",
    email: "stephano@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
  };

  return (
    <div className="profile-wrapper">
      {/* 👉 Clickable avatar */}
      <img
        src={user.avatar}
        alt="User Avatar"
        className="avatar-icon"
        onClick={toggleProfile}
      />

      {/* 👉 Dropdown content */}
      {open && (
        <div className="profile-dropdown">
          <h4>{user.name}</h4>
          <p>{user.email}</p>
          <div className="profile-actions">
            <button>Edit Profile</button>
            <button>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;

import React, { useState } from "react";
import "../styles/Profile.css";

function Profile() {
  const [open, setOpen] = useState(false);

  const toggleProfile = () => {
    setOpen(!open);
  };

  const user = {
    name: "Stephano Siame",
    email: "stephano@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
    role: "Farmer",
    region: "Dar es Salaam"
  };

  const profileMenuItems = [
    { icon: "👤", label: "My Profile", link: "/profile" },
    { icon: "📦", label: "My Orders", link: "/orders" },
    { icon: "🏪", label: "My Shop", link: "/shop" },
    { icon: "❤️", label: "Wishlist", link: "/wishlist" },
    { icon: "💳", label: "Payment Methods", link: "/payments" },
    { icon: "🏆", label: "Rewards", link: "/rewards" },
    { icon: "⚙️", label: "Settings", link: "/settings" },
    { icon: "❓", label: "Help Center", link: "/help" }
  ];

  return (
    <div className="profile-wrapper">
      <div className="profile-trigger" onClick={toggleProfile}>
        <img
          src={user.avatar}
          alt="User Avatar"
          className="profile-avatar"
        />
        <div className="profile-info">
          <span className="profile-greeting">Hello,</span>
          <span className="profile-name">{user.name.split(' ')[0]}</span>
        </div>
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className={`dropdown-arrow ${open ? 'open' : ''}`}
        >
          <polyline points="6,9 12,15 18,9"/>
        </svg>
      </div>

      {open && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <img src={user.avatar} alt="Profile" className="profile-header-avatar" />
            <div className="profile-header-info">
              <h3>{user.name}</h3>
              <p className="profile-role">{user.role} • {user.region}</p>
              <p className="profile-email">{user.email}</p>
            </div>
          </div>

          <div className="profile-menu">
            {profileMenuItems.map((item, index) => (
              <a key={index} href={item.link} className="profile-menu-item">
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6"/>
                </svg>
              </a>
            ))}
          </div>

          <div className="profile-footer">
            <button className="switch-account-btn">
              <span className="menu-icon">🔄</span>
              Switch Account
            </button>
            <button className="logout-btn">
              <span className="menu-icon">🚪</span>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
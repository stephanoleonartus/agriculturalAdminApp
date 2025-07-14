import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../styles/AdminLayout.css';

const AdminLayout = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  return (
    <div className="admin-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>AgriLink</h2>
        </div>
        <ul className="sidebar-menu">
          <li>
            <Link to="/admin">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/products">Manage Products</Link>
          </li>
          <li>
            <Link to="/admin/users">Manage Users</Link>
          </li>
          <li>
            <Link to="/admin/orders">Manage Orders</Link>
          </li>
          <li>
            <Link to="/admin/settings">Settings</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
      <div className="main-content">
        <div className="top-bar">
          <div className="welcome-message">
            {user && `Welcome back, ${user.first_name}!`}
          </div>
          <div className="profile-section">
            {user && user.profile_picture && (
              <img src={user.profile_picture} alt="User Avatar" />
            )}
          </div>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

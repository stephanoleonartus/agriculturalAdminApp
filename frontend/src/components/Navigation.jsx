import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from '../api/axios';
import '../styles/navigation.css';
import '../styles/Auth.css';
import Notification from "./Notification";
import { useLocation } from '../contexts/LocationContext';

function Navigation() {
  const [messageCount, setMessageCount] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const { location, locationError, locationLoading, permissionStatus, fetchLocation } = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      setIsAuthenticated(!!token);
      if (token) {
        try {
          const userRes = await axios.get('/auth/me/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(userRes.data);
          setUser(userRes.data);

          const cartRes = await axios.get('/products/cart/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCartItemCount(cartRes.data.total_items);

          const chatRes = await axios.get('/v1/chat/rooms/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMessageCount(chatRes.data.results.reduce((acc, room) => acc + room.unread_count, 0));
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    checkAuth();
    fetchLocation();

    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('authChange', checkAuth);
    };
  }, [fetchLocation]);


  const handleSearch = () => {
    navigate(`/products/products?search=${searchTerm}`);
  };

  return (
    <div className="navbar">
      {/* Logo Section */}
      <div className="logo">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>

        </Link>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input type="text" placeholder="Search for products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Menu navigation */}
      <div className="menu">
        {isAuthenticated && user ? (
          <div className="auth-links">
            <span className="nav-item">Hi, {user.first_name}</span>
            <button onClick={() => {
              axios.post('auth/logout/', {}, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
              });
              localStorage.removeItem('userInfo');
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              window.dispatchEvent(new Event('authChange'));
              navigate('/');
            }}>Logout</button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="nav-item">
              Login
            </Link>
            <Link to="/auth" className="nav-item create-account-btn">
              Create Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navigation;
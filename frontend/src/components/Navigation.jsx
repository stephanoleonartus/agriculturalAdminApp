import React from "react";
import { Link } from "react-router-dom";
import '../styles/navigation.css';
import '../styles/Auth.css';
import Notification from "./Notification";
import Profile from "./Profile";
import { useLocation } from '../contexts/LocationContext';

function Navigation() {
  // Placeholder for message count, to be fetched later
  const messageCount = 0; // Example: replace with actual count from state/context
  const [searchTerm, setSearchTerm] = React.useState('');
  const { location, locationError, locationLoading, permissionStatus, fetchLocation } = useLocation();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };

    checkAuth();
    fetchLocation();

    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('authChange', checkAuth);
    };
  }, [fetchLocation]);


  const handleSearch = () => {
    // Handle search functionality
  };

  return (
    <div className="navbar">
      {/* Geolocation Status */}
      <div className="location-info-section" onClick={fetchLocation}>
        Deliver to: {location ? location.region : '...'}
      </div>
      {/* Logo Section */}
      <div className="logo">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          🌾 AgriLink
        </Link>
      </div>


      {/* Menu navigation */}
      <div className="menu">
        <Link to="/products" className="nav-item">Products</Link>
        <Link to="/farmers" className="nav-item">Farmers</Link>
        <Link to="/suppliers" className="nav-item">Region Supplier</Link>

        {/* Message Icon */}
        <Link to="/chat" className="nav-item icon-link notification-container">
          💬
          {messageCount > 0 && <span className="dot message-dot">{messageCount > 9 ? '9+' : messageCount}</span>}
        </Link>

        {/* Cart Icon */}
        <Link to="/cart" className="nav-item icon-link notification-container">
          🛒
          {/* Placeholder for cart item count - to be fetched later */}
          {/* {cartItemCount > 0 && <span className="dot cart-dot">{cartItemCount > 9 ? '9+' : cartItemCount}</span>} */}
        </Link>

        <Notification /> {/* This is for general notifications */}

        {isAuthenticated ? (
          <Profile />
        ) : (
          <div className="auth-links">
            <Link to="/login" className="nav-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user auth-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>Login</span>
            </Link>
            <Link to="/signup" className="nav-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user-plus auth-icon"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
              <span>Register</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navigation;
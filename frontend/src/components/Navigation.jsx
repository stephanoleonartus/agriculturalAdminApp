import React, { useState, useEffect } from "react";
import axios from '../api/axios';
import '../styles/navigation.css';

function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      setIsAuthenticated(!!token);
      if (token) {
        try {
          const userRes = await axios.get('/api/auth/me/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(userRes.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    checkAuth();

    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  return (
    <div className="welcome-message">
      {isAuthenticated && user ? (
        <p>
          Hello Welcome {user.first_name} to Agrilink.com, Enjoy to look and view Products
        </p>
      ) : (
        <p>
          Hello Welcome to Agrilink.com, Enjoy to look and view Products
        </p>
      )}
    </div>
  );
}

export default Navigation;
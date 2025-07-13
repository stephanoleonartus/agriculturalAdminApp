// Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "customer"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post('http://localhost:8000/api/auth/login/', formData);
      const { data } = response;
        
      // Store JWT token and user info
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data.user));
      
      // Redirect based on user type
      if (data.user.userType === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      const errorData = error.response?.data;
      setError(errorData?.detail || errorData?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const UserTypeCard = ({ type, icon, title, description, selected, onClick }) => (
    <div 
      className={`user-type-card ${selected ? 'selected' : ''}`}
      onClick={() => onClick(type)}
    >
      <div className="user-type-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo">
            <h1>🌾 AgriLink.com</h1>
            <p>Connecting Farmers, Suppliers & Customers</p>
          </div>
        </div>

        <div className="login-form-container">
          <h2>Welcome Back!</h2>
          <p className="login-subtitle">Sign in to your account</p>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <div className="user-type-selection">
              <label>Login as:</label>
              <div className="user-type-grid">
                <UserTypeCard
                  type="customer"
                  icon="🛒"
                  title="Customer"
                  description="Buy fresh products"
                  selected={formData.userType === "customer"}
                  onClick={(type) => setFormData({...formData, userType: type})}
                />
                <UserTypeCard
                  type="farmer"
                  icon="👨‍🌾"
                  title="Farmer"
                  description="Sell your harvest"
                  selected={formData.userType === "farmer"}
                  onClick={(type) => setFormData({...formData, userType: type})}
                />
                <UserTypeCard
                  type="supplier"
                  icon="🏪"
                  title="Supplier"
                  description="Provide supplies"
                  selected={formData.userType === "supplier"}
                  onClick={(type) => setFormData({...formData, userType: type})}
                />
                <UserTypeCard
                  type="admin"
                  icon="⚙️"
                  title="Admin"
                  description="Manage platform"
                  selected={formData.userType === "admin"}
                  onClick={(type) => setFormData({...formData, userType: type})}
                />
              </div>
            </div>

            <div className="form-actions">
              <div className="remember-forgot">
                <label className="remember-me">
                  <input type="checkbox" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>

              <button 
                type="submit" 
                className="login-btn"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account? 
              <Link to="/signup" className="signup-link"> Sign up here</Link>
            </p>
          </div>
        </div>

        <div className="login-features">
          <h3>Why Choose AgriLink?</h3>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">🌾</span>
              <h4>Fresh Products</h4>
              <p>Direct from farmers to your table</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🚚</span>
              <h4>Fast Delivery</h4>
              <p>Quick and reliable delivery service</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💰</span>
              <h4>Fair Prices</h4>
              <p>Competitive pricing for everyone</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🤝</span>
              <h4>Trust & Security</h4>
              <p>Secure transactions and verified users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
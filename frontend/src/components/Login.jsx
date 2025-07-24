import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "../styles/Auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
      const response = await axios.post("auth/login/", formData);
      const { data: responseData } = response;

      // Store JWT token and user info
      localStorage.setItem("access_token", responseData.access);
      localStorage.setItem("refresh_token", responseData.refresh);
      localStorage.setItem("userInfo", JSON.stringify(responseData.user));

      // Dispatch auth event
      window.dispatchEvent(new Event("authChange"));

      // Redirect based on user role
      switch (responseData.user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "farmer":
          navigate("/dashboard");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (error) {
      const errorData = error.response?.data;
      setError(errorData?.detail || errorData?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="logo">
            <h1>🌾 AgriLink.com</h1>
            <p>Connecting Farmers & Customers</p>
          </div>
        </div>

        <div className="auth-form-container">
          <h2>Welcome Back!</h2>
          <p className="auth-subtitle">Sign in to your account</p>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
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

            <div className="form-actions">
              <div className="remember-forgot">
                <label className="remember-me">
                  <input type="checkbox" />
                  Remember me
                </label>
                <Link to="/forgot-password" a className="forgot-password">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?
              <Link to="/auth" className="toggle-auth">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-features">
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
};

export default Login;

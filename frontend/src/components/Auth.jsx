import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "../styles/Auth.css";

const Auth = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    userType: "customer",
    email: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
    region: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [regions, setRegions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get("auth/regions/");
        if (Array.isArray(response.data)) {
          setRegions(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch regions", error);
      }
    };
    fetchRegions();
  }, []);

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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const url = "auth/register/";
    const data = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
      role: formData.userType,
      region: formData.region,
    };

    try {
      const response = await axios.post(url, data);
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
        case "supplier":
          navigate("/dashboard");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData) {
        let errorMessages = [];
        for (const key in errorData) {
          errorMessages.push(`${key}: ${errorData[key]}`);
        }
        setError(errorMessages.join(' '));
      } else {
        setError("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const UserTypeCard = ({ type, icon, title, description, selected, onClick }) => (
    <div
      className={`user-type-card ${selected ? "selected" : ""}`}
      onClick={() => onClick(type)}
    >
      <div className="user-type-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="logo">
            <h1>🌾 AgriLink.com</h1>
            <p>Connecting Farmers, Suppliers & Customers</p>
          </div>
        </div>

        <div className="auth-form-container register">
          <h2>Create an Account</h2>
          <p className="auth-subtitle">Join our community</p>

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
              <label htmlFor="email">Email</label>
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
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
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
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="region">Region</label>
              <select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
              >
                <option value="">Select Region</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="user-type-selection">
              <label>Register as:</label>
              <div className="user-type-grid">
                <UserTypeCard
                  type="customer"
                  icon="🛒"
                  title="Customer"
                  description="Buy fresh products"
                  selected={formData.userType === "customer"}
                  onClick={(type) => setFormData({ ...formData, userType: type })}
                />
                <UserTypeCard
                  type="farmer"
                  icon="👨‍🌾"
                  title="Farmer"
                  description="Sell your harvest"
                  selected={formData.userType === "farmer"}
                  onClick={(type) => setFormData({ ...formData, userType: type })}
                />
                <UserTypeCard
                  type="supplier"
                  icon="🏪"
                  title="Supplier"
                  description="Provide supplies"
                  selected={formData.userType === "supplier"}
                  onClick={(type) => setFormData({ ...formData, userType: type })}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Registering..." : "Sign Up"}
              </button>
            </div>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?
              <Link to="/login" className="toggle-auth">
                Login here
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

export default Auth;

// Signup.jsx
import React, { useState } from "react";
import "../styles/Signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    confirmPassword: "",
    region: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    // Later: Send this data to Django backend via API
    console.log("Signup Data Submitted:", formData);
    setMessage("✅ Signup successful (simulated)");

    // Reset form
    setFormData({
      fullName: "",
      password: "",
      confirmPassword: "",
      region: "",
    });
  };

  return (
    <div className="signup-page">
      <h1>📝 Sign Up</h1>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <select
          name="region"
          value={formData.region}
          onChange={handleChange}
          required
        >
          <option value="">Select Region</option>
          <option value="Arusha">Arusha</option>
          <option value="Dodoma">Dodoma</option>
          <option value="Mbeya">Mbeya</option>
          <option value="Morogoro">Morogoro</option>
          <option value="Mwanza">Mwanza</option>
          {/* Add more regions as needed */}
        </select>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Signup;

import React, { useState } from "react";
import axios from "../api/axios";

function AddFarmerForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    region: "",
    role: "farmer",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("auth/register/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      alert("Farmer added successfully!");
      setFormData({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        region: "",
        role: "farmer",
      });
    } catch (error) {
      console.error("Error adding farmer:", error);
      alert("Failed to add farmer.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-farmer-form">
      <h2>Add Farmer</h2>
      <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
      <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input name="password" placeholder="Password" type="password" value={formData.password} onChange={handleChange} required />
      <input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
      <input name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
      <input name="region" placeholder="Region" value={formData.region} onChange={handleChange} required />
      <button type="submit">Add Farmer</button>
    </form>
  );
}

export default AddFarmerForm;

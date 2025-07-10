// AddFarmerForm.jsx
import React, { useState } from "react";

function AddFarmerForm({ setFarmers }) {
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    contact: "",
    grains: "",
    fruits: "",
    vegetables: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newFarmer = {
      id: Date.now(),
      name: formData.name,
      region: formData.region,
      contact: formData.contact,
      products: {
        grains: formData.grains.split(",").map((item) => item.trim()).filter(Boolean),
        fruits: formData.fruits.split(",").map((item) => item.trim()).filter(Boolean),
        vegetables: formData.vegetables.split(",").map((item) => item.trim()).filter(Boolean)
      }
    };

    setFarmers((prev) => [newFarmer, ...prev]);
    setFormData({
      name: "",
      region: "",
      contact: "",
      grains: "",
      fruits: "",
      vegetables: ""
    });
  };

  return (
    <form onSubmit={handleSubmit} className="add-farmer-form">
      <h2>Add Farmer</h2>
      <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <input name="region" placeholder="Region" value={formData.region} onChange={handleChange} required />
      <input name="contact" placeholder="Contact" value={formData.contact} onChange={handleChange} required />
      <input name="grains" placeholder="Grains (comma-separated)" value={formData.grains} onChange={handleChange} />
      <input name="fruits" placeholder="Fruits (comma-separated)" value={formData.fruits} onChange={handleChange} />
      <input name="vegetables" placeholder="Vegetables (comma-separated)" value={formData.vegetables} onChange={handleChange} />
      <button type="submit">Add Farmer</button>
    </form>
  );
}

export default AddFarmerForm;

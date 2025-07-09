// AddProductForm.jsx
import React, { useState } from "react";

function AddProductForm({ setProducts }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      ...formData,
      id: Date.now(),
    };

    // Update UI immediately
    setProducts((prev) => [newProduct, ...prev]);

    // Later: Send POST to Django backend
    // fetch('http://localhost:8000/api/products/', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newProduct),
    // })

    setFormData({ name: "", price: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="add-product-form">
      <h2>Add Product</h2>
      <input
        name="name"
        placeholder="Product name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        name="price"
        placeholder="Price (Tzs)"
        value={formData.price}
        onChange={handleChange}
        required
      />
      <button type="submit">Add Product</button>
    </form>
  );
}

export default AddProductForm;

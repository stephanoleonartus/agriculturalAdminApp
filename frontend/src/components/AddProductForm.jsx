// AddProductForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
// import "../styles/AddProductForm.css"; // Assuming a CSS file

const unitOptions = [
    { value: "kg", label: "Kilogram (kg)" },
    { value: "piece", label: "Piece" },
    { value: "bunch", label: "Bunch" },
    { value: "bag", label: "Bag" },
    { value: "crate", label: "Crate" },
    { value: "liter", label: "Liter (L)" },
];

const statusOptions = [
    { value: "available", label: "Available" },
    { value: "out_of_stock", label: "Out of Stock" },
    // 'discontinued' might be set via other means, not usually at creation
];


function AddProductForm({ setProducts }) { // setProducts might be used to refresh list
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "", // Will be ID
    price: "",
    unit: "kg",
    quantity_available: 0,
    min_order_quantity: 1,
    status: "available",
    harvest_date: "",
    expiry_date: "",
    origin_region: "", // Could be pre-filled based on farmer's profile
    is_organic: false,
    tags: "", // Comma-separated
    uploaded_images: [],
    uploaded_videos: [],
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch categories
    axios.get("http://localhost:8000/api/products/categories/")
      .then(response => {
        if (response.data && Array.isArray(response.data.results)) {
            setCategories(response.data.results);
        } else if (Array.isArray(response.data)) { // Non-paginated fallback
            setCategories(response.data);
        }
      })
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files });
    } else {
      setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    const productData = new FormData(); // Use FormData for file uploads
    productData.append("name", formData.name);
    productData.append("description", formData.description);
    productData.append("category", formData.category);
    productData.append("price", formData.price);
    productData.append("unit", formData.unit);
    productData.append("quantity_available", formData.quantity_available);
    productData.append("min_order_quantity", formData.min_order_quantity);
    productData.append("status", formData.status);
    if(formData.harvest_date) productData.append("harvest_date", formData.harvest_date);
    if(formData.expiry_date) productData.append("expiry_date", formData.expiry_date);
    if(formData.origin_region) productData.append("origin_region", formData.origin_region);
    productData.append("is_organic", formData.is_organic);
    if(formData.tags) productData.append("tags", formData.tags);

    for (let i = 0; i < formData.uploaded_images.length; i++) {
      productData.append("uploaded_images", formData.uploaded_images[i]);
    }
    for (let i = 0; i < formData.uploaded_videos.length; i++) {
      productData.append("uploaded_videos", formData.uploaded_videos[i]);
    }

    try {
      // TODO: Add Authorization header with JWT token
      const token = localStorage.getItem("accessToken"); // Example: retrieve token
      if (!token) {
          setMessage("❌ You must be logged in to add products.");
          // Could redirect to login or show login modal
          return;
      }

      const response = await axios.post("http://localhost:8000/api/products/", productData, { // Corrected endpoint
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      });
      setMessage("✅ Product added successfully!");
      console.log(response.data);
      // Optionally, call setProducts to refresh the list or add the new product
      // For simplicity, we might just clear the form or navigate away
      // To refresh product list: Ideally Products.jsx would have a refresh function passed as prop
      // or use a global state management solution.

      // Reset form (basic reset)
      setFormData({
        name: "", description: "", category: "", price: "", unit: "kg",
        quantity_available: 0, min_order_quantity: 1, status: "available",
        harvest_date: "", expiry_date: "", origin_region: "",
        is_organic: false, tags: "", uploaded_images: [], uploaded_videos: [],
      });
      // Clear file inputs if possible (difficult to do programmatically in a standard way)
      e.target.reset();

    } catch (error) {
      console.error("Error adding product:", error.response?.data || error.message);
      if (error.response && error.response.data) {
        setErrors(error.response.data);
        setMessage("❌ Failed to add product. Please check errors.");
      } else {
        setMessage("❌ An unexpected error occurred.");
      }
    }
  };

  const FieldError = ({ fieldName }) => errors[fieldName] ? <p className="error-message">{errors[fieldName].join ? errors[fieldName].join(" ") : errors[fieldName]}</p> : null;

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>
      {message && <p className={`message ${message.startsWith('✅') ? 'success' : 'error'}`}>{message}</p>}
      <form onSubmit={handleSubmit} className="add-product-form">

        <label htmlFor="name">Product Name:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        <FieldError fieldName="name"/>

        <label htmlFor="description">Description:</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
        <FieldError fieldName="description"/>

        <label htmlFor="category">Category:</label>
        <select id="category" name="category" value={formData.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        <FieldError fieldName="category"/>

        <label htmlFor="price">Price (TZS):</label>
        <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" />
        <FieldError fieldName="price"/>

        <label htmlFor="unit">Unit:</label>
        <select id="unit" name="unit" value={formData.unit} onChange={handleChange} required>
          {unitOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <FieldError fieldName="unit"/>

        <label htmlFor="quantity_available">Quantity Available:</label>
        <input type="number" id="quantity_available" name="quantity_available" value={formData.quantity_available} onChange={handleChange} required min="0" />
        <FieldError fieldName="quantity_available"/>

        <label htmlFor="min_order_quantity">Minimum Order Quantity:</label>
        <input type="number" id="min_order_quantity" name="min_order_quantity" value={formData.min_order_quantity} onChange={handleChange} min="1" />
        <FieldError fieldName="min_order_quantity"/>

        <label htmlFor="status">Status:</label>
        <select id="status" name="status" value={formData.status} onChange={handleChange} required>
          {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <FieldError fieldName="status"/>

        <label htmlFor="harvest_date">Harvest Date (Optional):</label>
        <input type="date" id="harvest_date" name="harvest_date" value={formData.harvest_date} onChange={handleChange} />
        <FieldError fieldName="harvest_date"/>

        <label htmlFor="expiry_date">Expiry Date (Optional):</label>
        <input type="date" id="expiry_date" name="expiry_date" value={formData.expiry_date} onChange={handleChange} />
        <FieldError fieldName="expiry_date"/>

        <label htmlFor="origin_region">Origin Region (Optional):</label>
        <input type="text" id="origin_region" name="origin_region" value={formData.origin_region} onChange={handleChange} />
        <FieldError fieldName="origin_region"/>

        <div className="checkbox-group">
            <input type="checkbox" id="is_organic" name="is_organic" checked={formData.is_organic} onChange={handleChange} />
            <label htmlFor="is_organic">Is Organic?</label>
        </div>
        <FieldError fieldName="is_organic"/>

        <label htmlFor="tags">Tags (Comma-separated, Optional):</label>
        <input type="text" id="tags" name="tags" value={formData.tags} onChange={handleChange} placeholder="e.g., fresh, local, sweet" />
        <FieldError fieldName="tags"/>

        <label htmlFor="uploaded_images">Product Images (select one or more):</label>
        <input type="file" id="uploaded_images" name="uploaded_images" onChange={handleChange} multiple accept="image/*" />
        <FieldError fieldName="uploaded_images"/>

        <label htmlFor="uploaded_videos">Product Videos (Optional, select one or more):</label>
        <input type="file" id="uploaded_videos" name="uploaded_videos" onChange={handleChange} multiple accept="video/*" />
        <FieldError fieldName="uploaded_videos"/>

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProductForm;

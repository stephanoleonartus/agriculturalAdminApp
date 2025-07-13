import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Auth.css';

const EditProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity_available: '',
    category: '',
    images: [],
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`products/${id}/`);
        const product = response.data;
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          quantity_available: product.quantity_available,
          category: product.category,
          images: [],
        });
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('There was an error fetching the product.');
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('products/categories/');
        setCategories(response.data.results);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchProduct();
    fetchCategories();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, images: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const productData = new FormData();
    productData.append('name', formData.name);
    productData.append('description', formData.description);
    productData.append('price', formData.price);
    productData.append('quantity_available', formData.quantity_available);
    productData.append('category', formData.category);

    if (formData.images.length > 0) {
      for (let i = 0; i < formData.images.length; i++) {
        productData.append('uploaded_images', formData.images[i]);
      }
    }

    try {
      await axios.put(`products/${id}/`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      navigate('/products');
    } catch (err) {
      setError('There was an error updating the product.');
      console.error("Error updating product:", err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Edit Product</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="quantity_available">Quantity Available</label>
            <input
              type="number"
              id="quantity_available"
              name="quantity_available"
              value={formData.quantity_available}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="images">Replace Images</label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleImageChange}
              multiple
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;

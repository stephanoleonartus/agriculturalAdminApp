// EditProduct.jsx
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
    unit: 'kg',
    min_order_quantity: 1,
    status: 'available',
    harvest_date: '',
    expiry_date: '',
    origin_region: '',
    is_organic: false,
    images: [],
    videos: [],
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('products/categories/');
        setCategories(response.data.results);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`products/products/${id}/`);
        setFormData(response.data);
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };

    fetchCategories();
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, images: e.target.files });
  };

  const handleVideoChange = (e) => {
    setFormData({ ...formData, videos: e.target.files });
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
    productData.append('unit', formData.unit);
    productData.append('min_order_quantity', formData.min_order_quantity);
    productData.append('status', formData.status);
    productData.append('harvest_date', formData.harvest_date);
    productData.append('expiry_date', formData.expiry_date);
    productData.append('origin_region', formData.origin_region);
    productData.append('is_organic', formData.is_organic);

    for (let i = 0; i < formData.images.length; i++) {
      productData.append('uploaded_images', formData.images[i]);
    }

    for (let i = 0; i < formData.videos.length; i++) {
      productData.append('uploaded_videos', formData.videos[i]);
    }

    try {
      await axios.put(`products/products/${id}/`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      navigate('/dashboard');
    } catch (err) {
      console.error("Error updating product:", err);
      if (err.response) {
        console.error("Error data:", err.response.data);
        console.error("Error status:", err.response.status);
        console.error("Error headers:", err.response.headers);
      } else if (err.request) {
        console.error("Error request:", err.request);
      } else {
        console.error('Error', err.message);
      }
      setError('There was an error updating the product. Please check the console for more details.');
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
            <label htmlFor="unit">Unit</label>
            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
            >
              <option value="kg">Kilogram</option>
              <option value="piece">Piece</option>
              <option value="bunch">Bunch</option>
              <option value="bag">Bag</option>
              <option value="crate">Crate</option>
              <option value="liter">Liter</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="min_order_quantity">Minimum Order Quantity</label>
            <input
              type="number"
              id="min_order_quantity"
              name="min_order_quantity"
              value={formData.min_order_quantity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="available">Available</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="harvest_date">Harvest Date</label>
            <input
              type="date"
              id="harvest_date"
              name="harvest_date"
              value={formData.harvest_date}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="expiry_date">Expiry Date</label>
            <input
              type="date"
              id="expiry_date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="origin_region">Origin Region</label>
            <input
              type="text"
              id="origin_region"
              name="origin_region"
              value={formData.origin_region}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="is_organic">
              <input
                type="checkbox"
                id="is_organic"
                name="is_organic"
                checked={formData.is_organic}
                onChange={(e) =>
                  setFormData({ ...formData, is_organic: e.target.checked })
                }
              />
              Is Organic?
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="images">Product Images</label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleImageChange}
              multiple
            />
          </div>
          <div className="form-group">
            <label htmlFor="videos">Product Videos</label>
            <input
              type="file"
              id="videos"
              name="videos"
              onChange={handleVideoChange}
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
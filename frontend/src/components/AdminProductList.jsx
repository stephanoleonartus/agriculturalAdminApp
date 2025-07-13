import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import '../styles/Admin.css';

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Fetch all products, including those not 'available'
        const response = await axios.get('products/?status=all'); // A custom filter or a new endpoint might be needed
        setProducts(response.data.results || []);
      } catch (err) {
        setError('There was an error fetching the products.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`products/${productId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setProducts(products.filter((p) => p.id !== productId));
      } catch (err) {
        setError('There was an error deleting the product.');
      }
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-product-list">
      <h2>Manage Products</h2>
      <Link to="/products/add" className="add-product-btn">
        Add New Product
      </Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Farmer</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.farmer_name}</td>
              <td>{product.status}</td>
              <td>
                <Link to={`/products/edit/${product.id}`} className="edit-btn">
                  Edit
                </Link>
                <button onClick={() => handleDelete(product.id)} className="delete-btn">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductList;

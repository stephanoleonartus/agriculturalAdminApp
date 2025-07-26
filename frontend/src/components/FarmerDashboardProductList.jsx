import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import '../styles/product.css';
import '../styles/Admin.css';

const DashboardProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('grid'); // 'grid' or 'table'

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/products/products/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setProducts(response.data.results || []);
    } catch (err) {
      setError('Error loading products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (productId) => {
    try {
      await axios.delete(`/products/products/${productId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setProducts(products.filter(p => p.id !== productId));
    } catch (err) {
      setError('Failed to delete product');
      console.error('Error deleting product:', err);
    }
  };
  
  if (loading) {
    return <div>Loading your products...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h2>Your Products</h2>
        <div>
          <button onClick={() => setView('grid')} className={view === 'grid' ? 'active' : ''}>Grid View</button>
          <button onClick={() => setView('table')} className={view === 'table' ? 'active' : ''}>Table View</button>
          <Link to="/products/add" className="add-product-btn">
            Add New Product
          </Link>
        </div>
      </div>
      {view === 'grid' ? (
        <div className="products-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="product-card">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>Price: {product.price}</p>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
              </div>
            ))
          ) : (
            <p>No products found. Add new products to get started.</p>
          )}
        </div>
      ) : (
        <div className="admin-product-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
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
      )}
    </div>
  );
};

export default DashboardProductList;

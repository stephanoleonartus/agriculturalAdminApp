import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import '../styles/ContactInfoPage.css';

const ContactInfoPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/products/${id}/`);
        setProduct(response.data);
      } catch (err) {
        setError('There was an error fetching the product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Loading contact information...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="contact-info-page">
      <div className="contact-info-layout">
        <div className="product-display">
          <img src={product.images.find(img => img.is_primary)?.image || 'https://via.placeholder.com/300'} alt={product.name} />
          <h3>{product.name}</h3>
          <p>${product.price} / {product.unit}</p>
        </div>
        <div className="contact-details">
          <h2>Contact Information</h2>
          <h4>{product.farmer.username}</h4>
          <p><strong>Email:</strong> {product.farmer.email}</p>
          <p><strong>Phone:</strong> {product.farmer.phone_number || 'Not available'}</p>
          <p><strong>Region:</strong> {product.farmer.region}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoPage;

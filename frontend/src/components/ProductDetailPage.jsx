import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleAddToCart = async () => {
    try {
      await axios.post('/api/products/cart/items/', { product_id: product.id, quantity: 1 });
      alert('Product added to cart!');
    } catch (err) {
      alert('There was an error adding the product to the cart.');
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}/`);
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
    return <div>Loading product details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-layout">
        <div className="product-images">
          {product.images.map((image) => (
            <img key={image.id} src={image.image} alt={image.alt_text} />
          ))}
        </div>
        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="price">${product.price} / {product.unit}</p>
          <p className="description">{product.description}</p>
          <div className="owner-info">
            <h4>Sold by:</h4>
            <p>{product.farmer.username}</p>
          </div>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

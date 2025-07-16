import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <div className="product-card-header">
          <span className="supplier-name">{product.farmer_name}</span>
          {product.is_verified && <span className="verified-badge"><i className="fas fa-check-circle"></i> Verified</span>}
        </div>
        <img src={product.primary_image} alt={product.name} className="product-image" />
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-pricing">
          <p className="price">TZS {product.price} / {product.unit}</p>
          <p className="moq">MOQ: {product.min_order_quantity} {product.unit}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

// ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom"; // For View Details button
// import "../styles/ProductCard.css"; // Assuming a CSS file for styling

// Fallback image if primary_image is not available
const FALLBACK_IMAGE_URL = "https://via.placeholder.com/150?text=No+Image";

function ProductCard({ product }) {
  // Provided by ProductListSerializer:
    id, name, category_name, farmer_name, farmer_region,
    price, unit, status, is_organic, primary_image (URL),
    average_rating, is_available, created_at

  const handleOrder = () => {
    // TODO: Implement add to cart functionality
    alert(`Adding ${product.name} to cart (not implemented yet).`);
  };

  const imageUrl = product.primary_image || FALLBACK_IMAGE_URL;

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <img src={imageUrl} alt={product.name} className="product-image" />
        <h3>{product.name}</h3>
      </Link>
      <p className="product-price">
        TZS {parseFloat(product.price).toFixed(2)} / {product.unit}
      </p>
      <p className="product-category">Category: {product.category_name}</p>
      <p className="product-farmer">
        By: {product.farmer_name} ({product.farmer_region})
      </p>
      {product.is_organic && <p className="product-organic-badge">🌿 Organic</p>}
      {<p>Rating: {product.average_rating ? parseFloat(product.average_rating).toFixed(1) : 'N/A'}/5</p> */}
      { <p>Status: {product.status} ({product.is_available ? "Available" : "Unavailable"})</p>}

      <div className="product-actions">
        <Link to={`/products/${product.id}`} className="btn btn-details">
          View Details
        </Link>
        {product.is_available ? (
          <button onClick={handleOrder} className="btn btn-order">
            Add to Cart
          </button>
        ) : (
          <button className="btn btn-unavailable" disabled>
            Unavailable
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;

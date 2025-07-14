// ProductCard.jsx
import React from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // For View Details button
// import "../styles/ProductCard.css"; // Assuming a CSS file for styling

// Fallback image if primary_image is not available
const FALLBACK_IMAGE_URL = "https://via.placeholder.com/150?text=No+Image";

function ProductCard({ product, onDelete }) {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const isOwner = user && user.id === product.farmer;

  // Provided by ProductListSerializer:
  // id, name, category_name, farmer_name, farmer_region,
  // price, unit, status, is_organic, primary_image (URL),
  // average_rating, is_available, created_at

  const handleAddToCart = async () => {
    try {
      await axios.post('cart-items/', { product_id: product.id, quantity: 1 });
      alert(`${product.name} added to cart!`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('There was an error adding the product to the cart.');
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await axios.post('wishlist/', { product_id: product.id });
      alert(`${product.name} added to wishlist!`);
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      alert('There was an error adding the product to the wishlist.');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      onDelete(product.id);
    }
  };

  const imageUrl = product.primary_image || FALLBACK_IMAGE_URL;

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <img src={product.primary_image || FALLBACK_IMAGE_URL} alt={product.name} className="product-image" />
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
      {/* <p>Rating: {product.average_rating ? parseFloat(product.average_rating).toFixed(1) : 'N/A'}/5</p> */}
      {/* <p>Status: {product.status} ({product.is_available ? "Available" : "Unavailable"})</p> */}

      <div className="product-actions">
        <Link to={`/products/${product.id}`} className="btn btn-details">
          View Details
        </Link>
        {product.is_available ? (
          <button onClick={handleAddToCart} className="btn btn-order">
            Add to Cart
          </button>
        ) : (
          <button className="btn btn-unavailable" disabled>
            Unavailable
          </button>
        )}
        <button onClick={handleAddToWishlist} className="btn btn-wishlist">
          Add to Wishlist
        </button>
        {isOwner && (
          <>
            <Link to={`/products/edit/${product.id}`} className="btn btn-edit">
              Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-delete">
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductCard;

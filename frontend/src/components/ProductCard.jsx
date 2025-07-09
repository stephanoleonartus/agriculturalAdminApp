// ProductCard.jsx
import React from "react";

function ProductCard({ product }) {
  const handleOrder = () => {
    alert(`Order placed for: ${product.name}`);
    // Later: Use POST to backend
  };

  const handleViewDetails = () => {
    alert(`Details:\nName: ${product.name}\nPrice: ${product.price}`);
    // Later: Show modal or navigate to detail page
  };

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>Price: {product.price} Tzs</p>
      <button onClick={handleViewDetails}>View Details</button>
      <button onClick={handleOrder}>Order</button>
    </div>
  );
}

export default ProductCard;

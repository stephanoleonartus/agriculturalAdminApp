// FarmerCard.jsx
import React from "react";

function FarmerCard({ farmer }) {
  return (
    <div className="farmer-card">
      <h3>{farmer.name}</h3>
      <p><strong>Region:</strong> {farmer.region}</p>
      <p><strong>Contact:</strong> {farmer.contact}</p>

      <div className="product-categories">
        {Object.entries(farmer.products).map(([category, items]) => (
          items.length > 0 && (
            <div key={category} className="product-category">
              <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
              <ul>
                {items.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default FarmerCard;

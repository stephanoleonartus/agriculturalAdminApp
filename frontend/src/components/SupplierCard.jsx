// SupplierCard.jsx
import React from "react";

function SupplierCard({ supplier }) {
  const handleClick = () => {
    alert(`Contact ${supplier.name} via ${supplier.contact}`);
    // In the future: open supplier details page or modal
  };

  return (
    <div className="supplier-card" onClick={handleClick}>
      <h4>{supplier.name}</h4>
      <p>📞 {supplier.contact}</p>
    </div>
  );
}

export default SupplierCard;

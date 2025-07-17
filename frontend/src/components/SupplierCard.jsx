// SupplierCard.jsx
import React from "react";
import { Link } from "react-router-dom";
// import '../styles/SupplierCard.css'; // Assuming a CSS file

const FALLBACK_AVATAR_URL = "https://via.placeholder.com/100?text=Supplier";

function SupplierCard({ supplier }) {
  const profile = supplier.supplier_profile;
  const userProfile = supplier.profile; // General UserProfile

  const displayName = profile?.business_name || `${supplier.first_name || ''} ${supplier.last_name || ''}`.trim() || supplier.username;
  const avatarUrl = supplier.profile_picture || userProfile?.profile_picture || FALLBACK_AVATAR_URL;

  // Handle region object - extract the name property
  const regionName = supplier.region?.name || supplier.region || 'N/A';

  return (
    <div className="supplier-card"> {/* Ensure this class is styled in Supplies.css or its own file */}
      <Link to={`/suppliers/${supplier.id}`} className="supplier-card-link-wrapper">
        <img src={avatarUrl} alt={displayName} className="supplier-avatar" />
        <h3>{displayName}</h3>
      </Link>
      <p><strong>Region:</strong> {regionName}</p>
      <p><strong>Type:</strong> {profile?.supplier_type ? profile.supplier_type.charAt(0).toUpperCase() + profile.supplier_type.slice(1) : 'N/A'}</p>

      {profile?.products_categories && profile.products_categories.length > 0 && (
        <div className="product-categories-list">
          <h4>Supplies:</h4>
          <ul>
            {profile.products_categories.slice(0, 3).map((cat, index) => (
              <li key={`cat-${index}`}>
                {typeof cat === 'object' ? cat.name || cat.label || JSON.stringify(cat) : cat}
              </li>
            ))}
            {profile.products_categories.length > 3 && <li>...and more</li>}
          </ul>
        </div>
      )}

      <div className="supplier-actions">
        <Link to={`/suppliers/${supplier.id}`} className="btn btn-profile">
          View Profile
        </Link>
        {/* <button className="btn btn-contact">Contact</button> */}
      </div>
    </div>
  );
}

export default SupplierCard;
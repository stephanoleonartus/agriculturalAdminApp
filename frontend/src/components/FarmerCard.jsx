// FarmerCard.jsx
import React from "react";
import { Link } from "react-router-dom";
// import '../styles/FarmerCard.css'; // Assuming a CSS file

const FALLBACK_AVATAR_URL = "https://via.placeholder.com/100?text=Farmer";

function FarmerCard({ farmer }) {
  const profile = farmer.farmer_profile;
  const userProfile = farmer.profile; // General UserProfile

  const displayName = profile?.farm_name || `${farmer.first_name || ''} ${farmer.last_name || ''}`.trim() || farmer.username;
  const avatarUrl = farmer.profile_picture || userProfile?.profile_picture || FALLBACK_AVATAR_URL;

  // Helper function to safely render array items that might be objects or strings
  const renderArrayItem = (item, fallback = 'Unknown') => {
    if (typeof item === 'string') {
      return item;
    }
    if (typeof item === 'object' && item !== null) {
      return item.name || item.label || item.title || fallback;
    }
    return fallback;
  };

  return (
    <div className="farmer-card">
      <Link to={`/farmers/${farmer.id}`} className="farmer-card-link-wrapper">
        <img src={avatarUrl} alt={displayName} className="farmer-avatar" />
        <h3>{displayName}</h3>
      </Link>
      <p><strong>Region:</strong> {renderArrayItem(farmer.region) || 'N/A'}</p>
      <p><strong>Farm Type:</strong> {renderArrayItem(profile?.farm_type) || 'N/A'}</p>

      {profile?.crops_grown && Array.isArray(profile.crops_grown) && profile.crops_grown.length > 0 && (
        <div className="product-list">
          <h4>Crops:</h4>
          <ul>
            {profile.crops_grown.slice(0, 3).map((crop, index) => (
              <li key={`crop-${index}`}>
                {renderArrayItem(crop)}
              </li>
            ))}
            {profile.crops_grown.length > 3 && <li>...and more</li>}
          </ul>
        </div>
      )}

      {profile?.livestock_types && Array.isArray(profile.livestock_types) && profile.livestock_types.length > 0 && (
        <div className="product-list">
          <h4>Livestock:</h4>
          <ul>
            {profile.livestock_types.slice(0, 3).map((livestock, index) => (
              <li key={`livestock-${index}`}>
                {renderArrayItem(livestock)}
              </li>
            ))}
            {profile.livestock_types.length > 3 && <li>...and more</li>}
          </ul>
        </div>
      )}

      <div className="farmer-actions">
        <Link to={`/farmers/${farmer.id}`} className="btn btn-profile">
          View Profile
        </Link>
        <button className="btn btn-contact">Contact</button>
      </div>
    </div>
  );
}

export default FarmerCard;
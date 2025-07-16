import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../api/axios';
import FarmerCard from './FarmerCard';
import SearchBar from './SearchBar';
import RegionFilter from './RegionFilter';
import '../styles/farmers.css';

const Farmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fetchFarmers = async () => {
      setLoading(true);
      try {
        // Using accounts/farmers/ endpoint (from fix-product-list-url branch)
        const response = await axios.get(`accounts/farmers/${location.search}`);
        console.log('Farmers response:', response.data); // Debug log
        setFarmers(response.data.results || []);
      } catch (err) {
        console.error('Error fetching farmers:', err);
        setError('There was an error fetching the farmers.');
      } finally {
        setLoading(false);
      }
    };

    const fetchRegions = async () => {
      try {
        // Using accounts/regions/ endpoint to match farmers endpoint
        const response = await axios.get('accounts/regions/');
        console.log('Regions response:', response.data); // Debug log
        setRegions(response.data || []);
      } catch (err) {
        console.error('Error fetching regions:', err);
      }
    };

    fetchFarmers();
    fetchRegions();
  }, [location.search]);

  const handleSearch = (searchTerm) => {
    const params = new URLSearchParams(location.search);
    if (searchTerm && searchTerm.trim() !== '') {
      params.set('search', searchTerm.trim());
    } else {
      params.delete('search');
    }
    window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
    // This will trigger the useEffect hook to refetch the farmers
    const popStateEvent = new PopStateEvent('popstate');
    dispatchEvent(popStateEvent);
  };

  const handleRegionFilter = (region) => {
    const params = new URLSearchParams(location.search);
    if (region && region.trim() !== '') {
      params.set('region', region.trim());
    } else {
      params.delete('region');
    }
    window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
    // This will trigger the useEffect hook to refetch the farmers
    const popStateEvent = new PopStateEvent('popstate');
    dispatchEvent(popStateEvent);
  };

  // Helper function to safely render region data
  const renderRegionData = (region) => {
    if (typeof region === 'string') {
      return region;
    }
    if (typeof region === 'object' && region !== null) {
      return region.name || region.label || region.value || 'Unknown Region';
    }
    return 'Unknown Region';
  };

  // Helper function to get region value for filtering
  const getRegionValue = (region) => {
    if (typeof region === 'string') {
      return region;
    }
    if (typeof region === 'object' && region !== null) {
      return region.value || region.name || region.label || '';
    }
    return '';
  };

  if (loading) {
    return <div>Loading farmers...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="farmers-page">
      <SearchBar onSearch={handleSearch} />
      
      {/* Using RegionFilter component (from fix-product-list-url branch) */}
      <RegionFilter onRegionFilter={handleRegionFilter} />
      
      {/* Fallback region filters if RegionFilter component doesn't handle regions state */}
      {regions.length > 0 && (
        <div className="region-filters-fallback" style={{ display: 'none' }}>
          <h3>Regions</h3>
          <ul>
            {regions.map((region, index) => (
              <li key={region.id || region.value || index} onClick={() => handleRegionFilter(getRegionValue(region))}>
                {renderRegionData(region)}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <h2>Our Farmers</h2>
      <div className="farmers-grid">
        {farmers.map((farmer) => (
          <FarmerCard key={farmer.id} farmer={farmer} />
        ))}
      </div>
    </div>
  );
};

export default Farmers;
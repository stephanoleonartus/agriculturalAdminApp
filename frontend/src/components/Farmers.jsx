import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../api/axios';
import FarmerCard from './FarmerCard';
import RegionFilter from './RegionFilter';
import '../styles/farmers.css';

const Farmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fetchFarmers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`auth/farmers/${location.search}`);
        setFarmers(response.data.results || []);
      } catch (err) {
        console.error(err);
        setError('There was an error fetching the farmers.');
      } finally {
        setLoading(false);
      }
    };
    fetchFarmers();
  }, [location.search]);

  const handleRegionFilter = (region) => {
    const params = new URLSearchParams(location.search);
    params.set('region', region);
    window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
    // This will trigger the useEffect hook to refetch the farmers
    const popStateEvent = new PopStateEvent('popstate');
    dispatchEvent(popStateEvent);
  };

  if (loading) {
    return <div>Loading farmers...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="farmers-page">
      <h2>Our Farmers</h2>
      <RegionFilter onRegionFilter={handleRegionFilter} />
      <div className="farmers-grid">
        {farmers.map((farmer) => (
          <FarmerCard key={farmer.id} farmer={farmer} />
        ))}
      </div>
    </div>
  );
};

export default Farmers;

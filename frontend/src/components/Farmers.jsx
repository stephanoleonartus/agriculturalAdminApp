import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import FarmerCard from './FarmerCard';
import '../styles/farmers.css';

const Farmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await axios.get('accounts/farmers/');
        setFarmers(response.data.results);
      } catch (err) {
        console.error(err);
        setError('There was an error fetching the farmers.');
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  if (loading) {
    return <div>Loading farmers...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="farmers-page">
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

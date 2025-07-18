import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import Chart from './Chart';

const CropDemandTrends = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrends = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/v1/analytics/crop-demand-trends/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setTrends(response.data);
      } catch (err) {
        setError('There was an error fetching the crop demand trends.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  if (loading) {
    return <div>Loading crop demand trends...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <h2>Crop Demand Trends</h2>
      <Chart data={{
        labels: trends.map(t => t.crop_name),
        values: trends.map(t => t.demand)
      }} />
    </div>
  );
};

export default CropDemandTrends;

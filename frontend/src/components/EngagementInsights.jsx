import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const EngagementInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const response = await axios.get('products/insights/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setInsights(response.data);
      } catch (err) {
        setError('There was an error fetching your engagement insights.');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) {
    return <div>Loading your engagement insights...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="engagement-insights">
      <h2>Engagement Insights</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Views</th>
            <th>Wishlist Adds</th>
            <th>Orders</th>
          </tr>
        </thead>
        <tbody>
          {insights.map((insight) => (
            <tr key={insight.product_id}>
              <td>{insight.product_name}</td>
              <td>{insight.views}</td>
              <td>{insight.wishlist_adds}</td>
              <td>{insight.orders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EngagementInsights;

import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const Discounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDiscounts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/v1/discounts/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setDiscounts(response.data);
      } catch (err) {
        setError('There was an error fetching the discounts.');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, []);

  if (loading) {
    return <div>Loading discounts...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <h2>Discounts</h2>
      <ul>
        {discounts.map(discount => (
          <li key={discount.id}>
            {discount.code}: {discount.percentage}% off
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Discounts;

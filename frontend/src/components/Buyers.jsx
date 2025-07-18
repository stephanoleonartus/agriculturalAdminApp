import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const Buyers = () => {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBuyers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/auth/buyers/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setBuyers(response.data.results || []);
      } catch (err) {
        setError('There was an error fetching the buyers.');
      } finally {
        setLoading(false);
      }
    };

    fetchBuyers();
  }, []);

  if (loading) {
    return <div>Loading buyers...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <h2>Buyers</h2>
      <ul>
        {buyers.map(buyer => (
          <li key={buyer.id}>{buyer.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default Buyers;

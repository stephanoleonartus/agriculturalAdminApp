import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRewards = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/rewards/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setRewards(response.data);
      } catch (err) {
        setError('There was an error fetching the rewards.');
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  if (loading) {
    return <div>Loading rewards...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <h3>Rewards</h3>
      {rewards.length === 0 ? (
        <p>You have no rewards.</p>
      ) : (
        <ul>
          {rewards.map(reward => (
            <li key={reward.id}>
              {reward.name} - {reward.points} points
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Rewards;

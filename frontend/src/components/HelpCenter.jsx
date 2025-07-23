import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const HelpCenter = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/help-center/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setArticles(response.data);
      } catch (err) {
        setError('There was an error fetching the help articles.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <div>Loading help articles...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <h3>Help Center</h3>
      {articles.map(article => (
        <div key={article.id}>
          <h4>{article.title}</h4>
          <p>{article.content}</p>
        </div>
      ))}
    </div>
  );
};

export default HelpCenter;

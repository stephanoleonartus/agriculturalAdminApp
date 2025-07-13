import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import SupplierCard from './SupplierCard';
import '../styles/Supplies.css';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('/api/accounts/suppliers/');
        setSuppliers(response.data.results);
      } catch (err) {
        console.error(err);
        setError('There was an error fetching the suppliers.');
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  if (loading) {
    return <div>Loading suppliers...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="suppliers-page">
      <h2>Our Suppliers</h2>
      <div className="suppliers-grid">
        {suppliers.map((supplier) => (
          <SupplierCard key={supplier.id} supplier={supplier} />
        ))}
      </div>
    </div>
  );
};

export default Suppliers;

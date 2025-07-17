import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../api/axios';
import SupplierCard from './SupplierCard';
import RegionFilter from './RegionFilter';
import '../styles/Supplies.css';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`auth/suppliers/${location.search}`);
        setSuppliers(response.data.results || []);
      } catch (err) {
        console.error(err);
        setError('There was an error fetching the suppliers.');
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, [location.search]);

  const handleRegionFilter = (region) => {
    const params = new URLSearchParams(location.search);
    params.set('region', region);
    window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
    // This will trigger the useEffect hook to refetch the suppliers
    const popStateEvent = new PopStateEvent('popstate');
    dispatchEvent(popStateEvent);
  };

  if (loading) {
    return <div>Loading suppliers...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="suppliers-page">
      <h2>Our Suppliers</h2>
      <RegionFilter onRegionFilter={handleRegionFilter} />
      <div className="suppliers-grid">
        {suppliers.map((supplier) => (
          <SupplierCard key={supplier.id} supplier={supplier} />
        ))}
      </div>
    </div>
  );
};

export default Suppliers;

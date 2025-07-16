import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import '../styles/FeaturedSuppliers.css';

const FeaturedSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('accounts/suppliers/?limit=4');
        setSuppliers(response.data.results);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };
    fetchSuppliers();
  }, []);

  return (
    <div className="featured-suppliers">
      <h3>Featured Suppliers</h3>
      <div className="supplier-grid">
        {suppliers.map((supplier) => (
          <div className="supplier-card" key={supplier.id}>
            <img src={supplier.profile_picture} alt={supplier.username} />
            <p>{supplier.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedSuppliers;

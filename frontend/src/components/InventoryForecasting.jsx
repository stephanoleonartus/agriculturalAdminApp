import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import '../styles/InventoryForecasting.css';

const InventoryForecasting = () => {
  const [seasonalProducts, setSeasonalProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    fetchSeasonalProducts();
    fetchLowStockProducts();
  }, []);

  const fetchSeasonalProducts = async () => {
    try {
      const response = await axios.get('/products/seasonal-products/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setSeasonalProducts(response.data.results);
    } catch (error) {
      console.error('Error fetching seasonal products:', error);
    }
  };

  const fetchLowStockProducts = async () => {
    try {
      // This endpoint needs to be created in the backend
      const response = await axios.get('/products/low-stock/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setLowStockProducts(response.data.results);
    } catch (error) {
      console.error('Error fetching low stock products:', error);
    }
  };

  return (
    <div className="inventory-forecasting-container">
      <h4>Inventory Availability & Forecasting</h4>
      <div className="seasonal-calendar">
        <h5>Seasonal Availability Calendar</h5>
        {seasonalProducts.length > 0 ? (
          <ul>
            {seasonalProducts.map((item) => (
              <li key={item.id}>
                <strong>{item.product.name}</strong> ({item.season_name}):{' '}
                {new Date(item.start_date).toLocaleDateString()} - {new Date(item.end_date).toLocaleDateString()}
                {item.pre_order_available && <span className="pre-order-badge">Pre-order available</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No seasonal products found.</p>
        )}
      </div>
      <div className="low-stock-alerts">
        <h5>Low Stock Alerts</h5>
        {lowStockProducts.length > 0 ? (
          <ul>
            {lowStockProducts.map((product) => (
              <li key={product.id}>
                <strong>{product.name}</strong> is running low (Stock: {product.stock_quantity})
              </li>
            ))}
          </ul>
        ) : (
          <p>No low stock alerts.</p>
        )}
      </div>
    </div>
  );
};

export default InventoryForecasting;

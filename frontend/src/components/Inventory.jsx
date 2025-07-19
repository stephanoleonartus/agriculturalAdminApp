import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const productsRes = await axios.get('/products/products/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setProducts(productsRes.data.results);

        const outOfStockRes = await axios.get('/products/products/out_of_stock/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setOutOfStockProducts(outOfStockRes.data);
      } catch (err) {
        setError('There was an error fetching the inventory.');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleUpdateStock = async (productId, newStock) => {
    try {
      await axios.post(`/products/products/${productId}/update_stock/`, { quantity: newStock }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      // Refetch inventory to update the list
      const productsRes = await axios.get('/products/products/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setProducts(productsRes.data.results);
    } catch (err) {
      console.error('Error updating stock:', err);
      alert('Failed to update stock.');
    }
  };

  if (loading) {
    return <div>Loading inventory...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <h2>Inventory</h2>
      <h3>All Products</h3>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - Stock: {product.quantity}
            <input type="number" onChange={(e) => handleUpdateStock(product.id, e.target.value)} />
          </li>
        ))}
      </ul>
      <h3>Out of Stock Products</h3>
      <ul>
        {outOfStockProducts.map(product => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Inventory;

import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import '../styles/PricingAndPayments.css';

const PricingAndPayments = () => {
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchInvoices();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products/products/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setProducts(response.data.results);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchInvoices = async () => {
    try {
      // This endpoint needs to be created in the backend
      const response = await axios.get('/orders/invoices/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setInvoices(response.data.results);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  return (
    <div className="pricing-and-payments-container">
      <h4>Pricing & Payment Management</h4>
      <div className="price-comparison">
        <h5>Price Comparison</h5>
        {products.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Farmer</th>
                <th>Price</th>
                <th>Discount</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.owner.username}</td>
                  <td>${product.price}</td>
                  <td>{product.discount > 0 ? `${product.discount}%` : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No products found.</p>
        )}
      </div>
      <div className="payment-history">
        <h5>Payment History</h5>
        {invoices.length > 0 ? (
          <ul>
            {invoices.map((invoice) => (
              <li key={invoice.id}>
                <strong>Invoice #{invoice.id}</strong> - ${invoice.amount} ({invoice.status})
              </li>
            ))}
          </ul>
        ) : (
          <p>No payment history found.</p>
        )}
      </div>
    </div>
  );
};

export default PricingAndPayments;

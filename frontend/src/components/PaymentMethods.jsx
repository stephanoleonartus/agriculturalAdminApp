import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/v1/payment-methods/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setPaymentMethods(response.data);
      } catch (err) {
        setError('There was an error fetching the payment methods.');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  if (loading) {
    return <div>Loading payment methods...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <h3>Payment Methods</h3>
      {paymentMethods.length === 0 ? (
        <p>You have no saved payment methods.</p>
      ) : (
        <ul>
          {paymentMethods.map(method => (
            <li key={method.id}>
              {method.card_type} **** **** **** {method.last_four}
              {method.is_default && <strong> (Default)</strong>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PaymentMethods;

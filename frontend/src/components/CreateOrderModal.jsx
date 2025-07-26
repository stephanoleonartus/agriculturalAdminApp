import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import '../styles/Modal.css';

const CreateOrderModal = ({ closeModal }) => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        product_id: '',
        quantity: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/products/', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
                });
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const orderData = {
                items: [
                    {
                        product_id: parseInt(formData.product_id),
                        quantity: parseInt(formData.quantity),
                    },
                ],
            };
            await axios.post('/orders/', orderData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });
            closeModal();
        } catch (error) {
            console.error('Error creating order:', error.response.data);
            setError('There was an error placing your order. Please try again.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Create Order</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="product_id">Product</label>
                        <select
                            id="product_id"
                            name="product_id"
                            value={formData.product_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a product</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="btn-primary">Create</button>
                        <button type="button" onClick={closeModal}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOrderModal;

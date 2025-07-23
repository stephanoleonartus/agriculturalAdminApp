import React, { useState } from 'react';
import axios from '../api/axios';
import '../styles/Modal.css';

const CreateOrderModal = ({ closeModal }) => {
    const [formData, setFormData] = useState({
        product: '',
        quantity: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/orders/orders/', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });
            closeModal();
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Create Order</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="product">Product</label>
                        <input
                            type="text"
                            id="product"
                            name="product"
                            value={formData.product}
                            onChange={handleChange}
                            required
                        />
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

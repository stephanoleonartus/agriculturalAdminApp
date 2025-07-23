import React, { useState } from 'react';
import axios from '../api/axios';
import '../styles/Modal.css';

const AddProductModal = ({ closeModal }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        reorder_level: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/products/farmer/products/', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });
            closeModal();
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add Product</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Product Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="stock">Stock</label>
                        <input
                            type="number"
                            id="stock"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reorder_level">Reorder Level</label>
                        <input
                            type="number"
                            id="reorder_level"
                            name="reorder_level"
                            value={formData.reorder_level}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="btn-primary">Add Product</button>
                        <button type="button" onClick={closeModal}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;

import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import '../styles/Modal.css';

const ProductForm = ({ closeModal, product }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        category: '',
        image: null,
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                quantity: product.quantity,
                category: product.category,
                image: null,
            });
        }
    }, [product]);

    const handleChange = (e) => {
        if (e.target.name === 'image') {
            setFormData({ ...formData, image: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            if (formData[key]) {
                data.append(key, formData[key]);
            }
        }

        try {
            if (product) {
                await axios.put(`/api/products/farmer/products/${product.id}/`, data, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await axios.post('/api/products/farmer/products/', data, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
            closeModal();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{product ? 'Edit Product' : 'Add Product'}</h2>
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
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Image</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="btn-primary">
                            {product ? 'Save Changes' : 'Add Product'}
                        </button>
                        <button type="button" onClick={closeModal}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;

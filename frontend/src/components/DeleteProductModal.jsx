import React from 'react';
import axios from '../api/axios';
import '../styles/Modal.css';

const DeleteProductModal = ({ closeModal, product, refreshProducts }) => {
    const handleDelete = async () => {
        try {
            await axios.delete(`/api/products/farmer/products/${product.id}/`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });
            refreshProducts();
            closeModal();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Delete Product</h2>
                <p>Are you sure you want to delete "{product.name}"?</p>
                <div className="modal-actions">
                    <button type="button" className="btn-danger" onClick={handleDelete}>Delete</button>
                    <button type="button" onClick={closeModal}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteProductModal;

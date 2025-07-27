import React from 'react';
import ProductQuality from './ProductQuality';
import '../styles/Modal.css';

const ProductQualityModal = ({ product, onClose }) => {
  if (!product) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h3>Product Quality Details</h3>
        <ProductQuality product={product} />
      </div>
    </div>
  );
};

export default ProductQualityModal;

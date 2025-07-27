import React from 'react';
import '../styles/ProductQuality.css';

const ProductQuality = ({ product }) => {
  return (
    <div className="product-quality-container">
      <h4>Product Quality</h4>
      <div className="quality-details">
        <p><strong>Grade:</strong> {product.quality_grade || 'N/A'}</p>
        <p><strong>Harvest Date:</strong> {product.harvest_date ? new Date(product.harvest_date).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Freshness:</strong> {product.freshness_indicator || 'N/A'}</p>
      </div>
      <div className="quality-certificates">
        <h5>Quality Certificates</h5>
        {product.certificates && product.certificates.length > 0 ? (
          <ul>
            {product.certificates.map((cert) => (
              <li key={cert.id}>
                <a href={cert.file} target="_blank" rel="noopener noreferrer">
                  {cert.name}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No certificates available.</p>
        )}
      </div>
      <div className="product-media">
        <h5>Photos & Videos</h5>
        <div className="media-gallery">
          {product.images && product.images.map((image) => (
            <img key={image.id} src={image.image} alt={image.alt_text} />
          ))}
          {product.videos && product.videos.map((video) => (
            <video key={video.id} src={video.video_file || video.video_url} controls />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductQuality;

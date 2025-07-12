// Rate.jsx
import React, { useState, useEffect } from "react";
import "../styles/Rate.css";

function Rate() {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    productId: "",
    farmerId: ""
  });
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    fetchReviews();
    fetchProducts();
    fetchFarmers();
  }, []);

  const fetchReviews = async () => {
    // TODO: Replace with Django API call
      const response = await fetch('http://localhost:8000/api/reviews/');
      const data = await response.json();
      setReviews(data);
    
    // Mock data
    setReviews([
      {
        id: 1,
        rating: 5,
        comment: "Excellent quality apples! Very fresh and tasty.",
        customer: "John Customer",
        product: "Fresh Apples",
        farmer: "John Mwakyusa",
        date: "2024-01-15",
        helpful: 12
      },
      {
        id: 2,
        rating: 4,
        comment: "Good bananas, delivered on time. Packaging could be better.",
        customer: "Mary Buyer",
        product: "Organic Bananas",
        farmer: "Asha Komba",
        date: "2024-01-20",
        helpful: 8
      },
      {
        id: 3,
        rating: 5,
        comment: "Amazing tomatoes! Perfect for my restaurant.",
        customer: "Restaurant Owner",
        product: "Red Tomatoes",
        farmer: "Peter Farmer",
        date: "2024-01-18",
        helpful: 15
      }
    ]);
  };

  const fetchProducts = async () => {
    // TODO: Replace with Django API call
      const response = await fetch('http://localhost:8000/api/products/');
      const data = await response.json();
      setProducts(data);
    
    // Mock data
    setProducts([
      { id: 1, name: "Fresh Apples", farmer: "John Mwakyusa" },
      { id: 2, name: "Organic Bananas", farmer: "Asha Komba" },
      { id: 3, name: "Red Tomatoes", farmer: "Peter Farmer" }
    ]);
  };

  const fetchFarmers = async () => {
    // TODO: Replace with Django API call
    const response = await fetch('http://localhost:8000/api/farmers/');
    const data = await response.json();
    setFarmers(data);
    
    // Mock data
    setFarmers([
      { id: 1, name: "John Mwakyusa", region: "Mbeya" },
      { id: 2, name: "Asha Komba", region: "Morogoro" },
      { id: 3, name: "Peter Farmer", region: "Arusha" }
    ]);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with Django API call
        const response = await fetch('http://localhost:8000/api/reviews/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newReview)
        });

      // Mock submission
      const review = {
        id: Date.now(),
        ...newReview,
        customer: "Current User",
        product: products.find(p => p.id === parseInt(newReview.productId))?.name || "Unknown Product",
        farmer: farmers.find(f => f.id === parseInt(newReview.farmerId))?.name || "Unknown Farmer",
        date: new Date().toISOString().split('T')[0],
        helpful: 0
      };

      setReviews(prev => [review, ...prev]);
      setNewReview({
        rating: 5,
        comment: "",
        productId: "",
        farmerId: ""
      });

      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleHelpful = async (reviewId) => {
    // TODO: Replace with Django API call
      await fetch(`http://localhost:8000/api/reviews/${reviewId}/helpful/`, {
        method: 'POST'
      });

    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === "all") return true;
    return review.rating === parseInt(filter);
  });

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }));

  return (
    <div className="rate-page">
      <div className="rate-header">
        <h1>⭐ Reviews & Ratings</h1>
        <p>Share your experience and help others make informed decisions</p>
      </div>

      <div className="rate-content">
        <div className="rate-sidebar">
          <div className="rating-summary">
            <h3>Overall Rating</h3>
            <div className="average-rating">
              <span className="rating-number">{averageRating}</span>
              {renderStars(Math.round(averageRating))}
              <p>Based on {reviews.length} reviews</p>
            </div>

            <div className="rating-breakdown">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="rating-bar">
                  <span className="rating-label">{rating} ⭐</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="rating-count">({count})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rating-filters">
            <h4>Filter by Rating</h4>
            <div className="filter-buttons">
              <button 
                className={filter === "all" ? "active" : ""}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              {[5, 4, 3, 2, 1].map(rating => (
                <button
                  key={rating}
                  className={filter === rating.toString() ? "active" : ""}
                  onClick={() => setFilter(rating.toString())}
                >
                  {rating} ⭐
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rate-main">
          <div className="add-review-section">
            <h3>Write a Review</h3>
            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Select Product</label>
                  <select
                    value={newReview.productId}
                    onChange={(e) => setNewReview({...newReview, productId: e.target.value})}
                    required
                  >
                    <option value="">Choose a product...</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.farmer}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Select Farmer</label>
                  <select
                    value={newReview.farmerId}
                    onChange={(e) => setNewReview({...newReview, farmerId: e.target.value})}
                    required
                  >
                    <option value="">Choose a farmer...</option>
                    {farmers.map(farmer => (
                      <option key={farmer.id} value={farmer.id}>
                        {farmer.name} - {farmer.region}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Your Rating</label>
                {renderStars(newReview.rating, true, (rating) => 
                  setNewReview({...newReview, rating})
                )}
              </div>

              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  placeholder="Share your experience with this product or farmer..."
                  rows="4"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="submit-review-btn">
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>

          <div className="reviews-list">
            <h3>Customer Reviews ({filteredReviews.length})</h3>
            {filteredReviews.length === 0 ? (
              <div className="no-reviews">
                <p>No reviews found for the selected filter.</p>
              </div>
            ) : (
              filteredReviews.map(review => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <img 
                        src={`https://i.pravatar.cc/40?img=${review.id}`} 
                        alt={review.customer}
                        className="reviewer-avatar"
                      />
                      <div>
                        <h4>{review.customer}</h4>
                        <p className="review-date">{new Date(review.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>

                  <div className="review-content">
                    <div className="review-details">
                      <span className="product-name">Product: {review.product}</span>
                      <span className="farmer-name">Farmer: {review.farmer}</span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>

                  <div className="review-actions">
                    <button 
                      className="helpful-btn"
                      onClick={() => handleHelpful(review.id)}
                    >
                      👍 Helpful ({review.helpful})
                    </button>
                    <button className="reply-btn">
                      💬 Reply
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rate;
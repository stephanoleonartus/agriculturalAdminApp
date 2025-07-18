// Rate.jsx
import React, { useState, useEffect } from "react";
import axios from '../api/axios';
import "../styles/Rate.css";

function Rate() {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    product: "",
    reviewee: ""
  });
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [reply, setReply] = useState({ reviewId: null, text: '' });

  useEffect(() => {
    fetchReviews();
    fetchProducts();
    fetchFarmers();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get('/api/v1/reviews/reviews/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setReviews(response.data.results);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products/products/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setProducts(response.data.results);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchFarmers = async () => {
    try {
      const response = await axios.get('/api/auth/farmers/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setFarmers(response.data.results);
    } catch (error) {
      console.error("Error fetching farmers:", error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/v1/reviews/reviews/', newReview, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchReviews();
      setNewReview({
        rating: 5,
        comment: "",
        product: "",
        reviewee: ""
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
    try {
      await axios.post(`/api/v1/reviews/reviews/${reviewId}/mark_helpful/`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchReviews();
    } catch (error) {
      console.error("Error marking review as helpful:", error);
    }
  };

  const handleReply = async (reviewId) => {
    try {
      await axios.post(`/api/v1/reviews/reviews/${reviewId}/respond/`, { response_text: reply.text }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchReviews();
      setReply({ reviewId: null, text: '' });
    } catch (error) {
      console.error("Error replying to review:", error);
    }
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
                    value={newReview.product}
                    onChange={(e) => setNewReview({ ...newReview, product: e.target.value })}
                    required
                  >
                    <option value="">Choose a product...</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.owner.username}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Select Farmer</label>
                  <select
                    value={newReview.reviewee}
                    onChange={(e) => setNewReview({ ...newReview, reviewee: e.target.value })}
                    required
                  >
                    <option value="">Choose a farmer...</option>
                    {farmers.map(farmer => (
                      <option key={farmer.id} value={farmer.id}>
                        {farmer.username} - {farmer.region.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Your Rating</label>
                {renderStars(newReview.rating, true, (rating) =>
                  setNewReview({ ...newReview, rating })
                )}
              </div>

              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
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
                        alt={review.reviewer_name}
                        className="reviewer-avatar"
                      />
                      <div>
                        <h4>{review.reviewer_name}</h4>
                        <p className="review-date">{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>

                  <div className="review-content">
                    <div className="review-details">
                      <span className="product-name">Product: {review.product.name}</span>
                      <span className="farmer-name">Farmer: {review.reviewee_name}</span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>

                  <div className="review-actions">
                    <button
                      className="helpful-btn"
                      onClick={() => handleHelpful(review.id)}
                    >
                      👍 Helpful ({review.helpful_count})
                    </button>
                    <button className="reply-btn" onClick={() => setReply({ reviewId: review.id, text: '' })}>
                      💬 Reply
                    </button>
                    {reply.reviewId === review.id && (
                      <div className="reply-form">
                        <textarea value={reply.text} onChange={(e) => setReply({ ...reply, text: e.target.value })} />
                        <button onClick={() => handleReply(review.id)}>Submit Reply</button>
                      </div>
                    )}
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
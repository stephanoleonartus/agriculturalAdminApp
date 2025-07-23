// Product.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import '../styles/product.css';
import '../styles/ProductDetailPage.css';
import '../styles/Auth.css';
import '../styles/Modal.css';
import CategoryMenu from './CategoryMenu';
import OrderForm from './OrderForm';

const FALLBACK_IMAGE_URL = "https://via.placeholder.com/150?text=No+Image";

const ProductCard = ({ product, onDelete, onPlaceOrder }) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const isOwner = user && user.id === product.farmer;
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    try {
      await axios.post('/products/cart/add_item/', { product_id: product.id, quantity: 1 }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      alert(`${product.name} added to cart!`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('There was an error adding the product to the cart.');
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await axios.post('/products/wishlist/toggle/', { product_id: product.id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      alert(`${product.name} added to wishlist!`);
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      alert('There was an error adding the product to the wishlist.');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      onDelete(product.id);
    }
  };

  const handlePlaceOrderClick = () => {
    if (onPlaceOrder) {
      onPlaceOrder();
    } else {
      navigate(`/products/${product.id}`);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <img src={product.image ? product.image : FALLBACK_IMAGE_URL} alt={product.name} className="product-image" />
        <h3>{product.name}</h3>
      </Link>
      <p className="product-price">
        TZS {parseFloat(product.price).toFixed(2)} / {product.unit}
      </p>
      <p className="product-category">Category: {product.category_name}</p>
      <p className="product-farmer">
        By: {product.farmer_name} ({product.farmer_region})
      </p>
      {product.is_organic && <p className="product-organic-badge">🌿 Organic</p>}
      <div className="product-actions">
        <Link to={`/products/${product.id}`} className="btn btn-details">
          View Details
        </Link>
        {product.is_available ? (
          <button onClick={handleAddToCart} className="btn btn-order">
            Add to Cart
          </button>
        ) : (
          <button onClick={handlePlaceOrderClick} className="btn btn-order">
            Place Order
          </button>
        )}
        <button onClick={handleAddToWishlist} className="btn btn-wishlist">
          Add to Wishlist
        </button>
        {isOwner && (
          <>
            <Link to={`/products/edit/${product.id}`} className="btn btn-edit">
              Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-delete">
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleOpenOrderModal = () => {
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
  };

  const handleAddToCart = async () => {
    try {
      await axios.post('/products/cart/add_item/', { product_id: product.id, quantity: 1 }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      alert('Product added to cart!');
    } catch (err) {
      alert('There was an error adding the product to the cart.');
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await axios.post('/products/wishlist/toggle/', { product_id: product.id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      alert('Product added to wishlist!');
    } catch (err) {
      alert('There was an error adding the product to the wishlist.');
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/products/${id}/`);
        setProduct(response.data);
      } catch (err) {
        setError('There was an error fetching the product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Loading product details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-layout">
        <div className="product-images">
          <img src={product.image ? product.image : FALLBACK_IMAGE_URL} alt={product.name} />
        </div>
        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="price">TZS {parseFloat(product.price).toFixed(2)} / {product.unit}</p>
          <div className="owner-info">
            <h4>Sold by:</h4>
            <p>
              {product.farmer_name || product.farmer?.username || 'Unknown Farmer'}
              {product.farmer_region && ` (${product.farmer_region})`}
            </p>
          </div>
          {product.is_organic && <p className="organic-badge">🌿 Organic</p>}
          {product.is_available ? (
            <>
              <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
              <button className="add-to-wishlist-btn" onClick={handleAddToWishlist}>Add to Wishlist</button>
              <button className="btn btn-order" onClick={handleOpenOrderModal}>
                Order Now
              </button>
            </>
          ) : (
            <button className="btn btn-order" onClick={handleOpenOrderModal}>
              Place Order
            </button>
          )}
        </div>
      </div>
      <div className="product-description">
        <h3>Product Description</h3>
        <p>{product.description}</p>
      </div>
      {isOrderModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Place Order</h3>
              <button className="modal-close-btn" onClick={handleCloseOrderModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <OrderForm product={product} onClose={handleCloseOrderModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity_available: '',
    category: '',
    images: [],
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/products/categories/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setCategories(response.data.results || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, images: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const productData = new FormData();
    productData.append('name', formData.name);
    productData.append('description', formData.description);
    productData.append('price', formData.price);
    productData.append('quantity_available', formData.quantity_available);
    productData.append('category', formData.category);

    for (let i = 0; i < formData.images.length; i++) {
      productData.append('uploaded_images', formData.images[i]);
    }

    try {
      await axios.post('/products/products/', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      navigate('/products');
    } catch (err) {
      console.error("Error adding product:", err);
      if (err.response) {
        console.error("Error data:", err.response.data);
        console.error("Error status:", err.response.status);
        console.error("Error headers:", err.response.headers);
      } else if (err.request) {
        console.error("Error request:", err.request);
      } else {
        console.error('Error', err.message);
      }
      setError('There was an error adding the product. Please check the console for more details.');
      console.error("Error adding product:", err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Add a New Product</h2>
        {error && <div className="error-message">{error}</div>}
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
            <label htmlFor="quantity_available">Quantity Available</label>
            <input
              type="number"
              id="quantity_available"
              name="quantity_available"
              value={formData.quantity_available}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="images">Product Images</label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleImageChange}
              multiple
              required
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageClass, setPageClass] = useState(''); // Moved to the top with other hooks
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/products/products/${location.search}`);
        setProducts(response.data.results || []);
      } catch (err) {
        setError('Error loading products');
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('/products/categories/');
        setCategories(response.data.results || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    const fetchRegions = async () => {
      try {
        const response = await axios.get('/auth/regions/');
        setRegions(response.data || []);
      } catch (err) {
        console.error('Error fetching regions:', err);
      }
    };

    fetchProducts();
    fetchCategories();
    fetchRegions();
  }, [location.search]);

  const handleFilterChange = (filterType, value) => {
    const params = new URLSearchParams(location.search);
    params.set(filterType, value);
    window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
    // This will trigger the useEffect hook to refetch the products
    const popStateEvent = new PopStateEvent('popstate');
    dispatchEvent(popStateEvent);
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`/products/products/${productId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setProducts(products.filter((p) => p.id !== productId));
    } catch (err) {
      setError('There was an error deleting the product.');
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className={`products-page ${pageClass}`}>
      <div className="products-header">
        <h2
          className="product-heading"
          onMouseEnter={() => setPageClass('product-hover')}
          onMouseLeave={() => setPageClass('')}
        >
          Products
        </h2>
        <h2
          className="farmer-heading"
          onMouseEnter={() => setPageClass('farmer-hover')}
          onMouseLeave={() => setPageClass('')}
        >
          Farmers
        </h2>
      </div>
      <CategoryMenu />
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={handleDelete}
            onPlaceOrder={() => navigate(`/products/${product.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export { Products, ProductDetailPage, AddProduct, ProductCard };
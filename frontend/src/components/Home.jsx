import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../api/axios';
import SearchBar from './SearchBar';
import { useLocation } from '../contexts/LocationContext'; // Import useLocation
import '../styles/home.css';

const items = [
  "Fresh Apples",
  "Organic Bananas",
  "Red Tomatoes",
  "Baby Carrots",
  "Crisp Cabbage",
  "Golden Potatoes",
  "Sweet Oranges",
  "Green Beans",
  "Sweet Corn",
  "Cucumbers",
  "Maize Seeds",
  "Fertilizers",
  "Irrigation Equipment",
  "Pesticides",
  "Farm Tools",
  "Tractors",
  "Harvesters"
];

const cardData = [
  {
    id: 1,
    title: "Fresh Apples",
    price: "2000",
    src: "/apple.png",
    farmer: "John Mwakyusa",
    region: "Mbeya",
    category: "Fruits",
    description: "Premium quality red apples, freshly harvested from organic farms in Mbeya region.",
    stock: 150,
    rating: 4.8,
    reviews: 24,
    supplier_type: "Farmer",
    contact: "+255 712 345 678",
    minimum_order: "10 kg",
    harvest_date: "2024-01-15",
    certifications: ["Organic", "GAP Certified"]
  },
  {
    id: 2,
    title: "Organic Bananas",
    price: "3000",
    src: "/bananas.png",
    farmer: "Asha Komba",
    region: "Morogoro",
    category: "Fruits",
    description: "Sweet and nutritious organic bananas, perfect for healthy snacking and export quality.",
    stock: 200,
    rating: 4.6,
    reviews: 18,
    supplier_type: "Farmer",
    contact: "+255 765 000 111",
    minimum_order: "20 kg",
    harvest_date: "2024-01-20",
    certifications: ["Organic", "Fair Trade"]
  },
  {
    id: 3,
    title: "Tomatoes Pack",
    price: "10000",
    src: "/tomatoPack.png",
    farmer: "Peter Mtama",
    region: "Arusha",
    category: "Vegetables",
    description: "Fresh red tomatoes packed in convenient boxes, ideal for restaurants and bulk buyers.",
    stock: 50,
    rating: 4.9,
    reviews: 31,
    supplier_type: "Farmer",
    contact: "+255 787 456 789",
    minimum_order: "5 boxes",
    harvest_date: "2024-01-25",
    certifications: ["GAP Certified"]
  },
  {
    id: 4,
    title: "NPK Fertilizer",
    price: "85000",
    src: "/fertilizer.png",
    farmer: "AgriSupply Tanzania",
    region: "Dar es Salaam",
    category: "Supplies",
    description: "High-quality NPK fertilizer 20-10-10 for enhanced crop growth and yield.",
    stock: 500,
    rating: 4.7,
    reviews: 45,
    supplier_type: "Supplier",
    contact: "+255 744 567 890",
    minimum_order: "1 bag (50kg)",
    manufacture_date: "2024-01-10",
    certifications: ["ISO 9001", "Quality Assured"]
  },
  {
    id: 5,
    title: "Irrigation System",
    price: "1500000",
    src: "/irrigation.png",
    farmer: "TechFarm Solutions",
    region: "Arusha",
    category: "Equipment",
    description: "Complete drip irrigation system for 1-hectare farm, water-efficient technology.",
    stock: 15,
    rating: 4.8,
    reviews: 12,
    supplier_type: "Supplier",
    contact: "+255 756 789 012",
    minimum_order: "1 system",
    warranty: "2 years",
    certifications: ["CE Certified", "ISO 14001"]
  },
  {
    id: 6,
    title: "Maize Seeds (Hybrid)",
    price: "45000",
    src: "/maize_seeds.png",
    farmer: "Tanzania Seed Company",
    region: "Morogoro",
    category: "Seeds",
    description: "High-yielding hybrid maize seeds, drought-resistant variety suitable for all regions.",
    stock: 200,
    rating: 4.9,
    reviews: 67,
    supplier_type: "Supplier",
    contact: "+255 723 456 789",
    minimum_order: "10 kg",
    germination_rate: "95%",
    certifications: ["Certified Seeds", "Government Approved"]
  }
];

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(cardData);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [userName, setUserName] = useState(""); // Will come from backend
  const [counters, setCounters] = useState({
    products: 0,
    farmers: 0,
    suppliers: 0,
    regions: 0
  });
  
  const navigate = useNavigate();
  const { location, locationError, locationLoading, permissionStatus, fetchLocation } = useLocation();
  const isLoggedIn = true; // Mock variable

  useEffect(() => {
    // Request location when component mounts, or user can trigger it via a button
    // For now, let's try fetching on mount if permission was previously granted or is prompt
    if (permissionStatus !== 'denied') {
        // fetchLocation(); // Uncomment to fetch on mount
    }
  }, [permissionStatus, fetchLocation]);


  // Counter animation effect
  useEffect(() => {
    const targetValues = {
      products: 1250,
      farmers: 850,
      suppliers: 320,
      regions: 26
    };

    const duration = 2000; // 2 seconds
    const steps = 60; // 60 FPS
    const stepDuration = duration / steps;

    const intervals = [];

    Object.keys(targetValues).forEach(key => {
      const target = targetValues[key];
      const increment = target / steps;
      let current = 0;
      
      const intervalId = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(intervalId);
        }
        setCounters(prev => ({
          ...prev,
          [key]: Math.floor(current)
        }));
      }, stepDuration);
      
      intervals.push(intervalId);
    });

    return () => {
      intervals.forEach(intervalId => clearInterval(intervalId));
    };
  }, []);

  // Fetch user data from backend
  useEffect(() => {
    // TODO: Replace with actual Django API call
    // fetch('http://localhost:8000/api/auth/user/', {
    //   headers: {
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //   },
    // })
    // .then(response => response.json())
    // .then(data => setUserName(data.first_name || data.username))
    // .catch(error => console.error('Error fetching user:', error));

    // Mock data for now
    setUserName("Stephano");
  }, []);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get('products/?ordering=-created_at&limit=6');
        setFilteredProducts(response.data.results || []);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setFilteredProducts([]);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(e.target.value.trim() !== "");
  };

  const handleSelect = (item) => {
    setSearchTerm(item);
    setShowDropdown(false);
  };

  const handleViewDetails = (product) => {
    // Navigate to product details page
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const handleAddToCart = (product, quantity = 1) => {
    // TODO: Replace with Django API call
    // fetch('http://localhost:8000/api/cart/add/', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //   },
    //   body: JSON.stringify({
    //     product_id: product.id,
    //     quantity: quantity
    //   })
    // })
    // .then(response => response.json())
    // .then(data => {
    //   if (data.success) {
    //     alert(`${product.title} added to cart!`);
    //   }
    // })
    // .catch(error => console.error('Error adding to cart:', error));

    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    alert(`${product.title} added to cart!`);
  };

  const handleContactSupplier = (product) => {
    // TODO: Navigate to chat or contact form
    navigate(`/chat`, { state: { recipient: product.farmer, product } });
  };

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? "star filled" : "star"}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  const categories = ["all", "fruits", "vegetables", "seeds", "supplies", "equipment"];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>🌾 AgriLink.com - Connect. Trade. Grow.</h1>
          <p>Tanzania's Leading Agricultural B2B Marketplace</p>
          <p className="hero-subtitle">Connecting Farmers, Suppliers & Buyers Across All Regions</p>
          
          {/* Centered Search Bar */}
          <div className="hero-search-container">
            <div className="search-section">
              <input
                type="text"
                placeholder="🔍 Search products, farmers, suppliers, or regions..."
                value={searchTerm}
                onChange={handleChange}
                onFocus={() => setShowDropdown(searchTerm.trim() !== "")}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                className="search-input hero-search"
              />
              <button onClick={() => navigate(`/products?search=${searchTerm}`)}>Search</button>
              {showDropdown && filteredItems.length > 0 && (
                <ul className="search-suggestions">
                  {filteredItems.map((item, index) => (
                    <li
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSelect(item)}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          {/* Horizontal Stats Counter */}
          <div className="hero-stats">
            <div className="stat">
              <h3>{counters.products.toLocaleString()}+</h3>
              <p>Products</p>
            </div>
            <div className="stat">
              <h3>{counters.farmers.toLocaleString()}+</h3>
              <p>Farmers</p>
            </div>
            <div className="stat">
              <h3>{counters.suppliers.toLocaleString()}+</h3>
              <p>Suppliers</p>
            </div>
            <div className="stat">
              <h3>{counters.regions}</h3>
              <p>Regions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome message from backend */}
      <div className="welcome-msg">
        {isLoggedIn ? (
          `Welcome back, ${userName}! ? Ready to explore fresh opportunities?`
        ) : (
          'Welcome and register your account or login to explore the opportunities.'
        )}
      </div>


      {/* New Alibaba-style Search Bar */}
      <div className="alibaba-search-bar-section" style={{ margin: '40px 20px' }}>
        {/* Optionally add a title here like "Find Exactly What You Need" */}
        <SearchBar />
      </div>

      {/* Category Filters */}
      <div className="category-filters">
        <h3>Browse by Category</h3>
        <div className="category-buttons">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => navigate(`/products?category__name__icontains=${category}`)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="products-section">
        <h2>🛒 Featured Products & Supplies</h2>
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-image-container">
                <img src={product.src} alt={product.title} className="product-image" />
                <div className="product-badge">{product.category}</div>
                <div className="supplier-badge">{product.supplier_type}</div>
              </div>
              
              <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-supplier">
                  {product.supplier_type === 'Farmer' ? '👨‍🌾' : '🏭'} {product.farmer}
                </p>
                <p className="product-region">📍 {product.region}</p>
                
                <div className="product-rating">
                  {renderStars(Math.floor(product.rating))}
                  <span className="rating-text">({product.reviews} reviews)</span>
                </div>
                
                <div className="product-price-section">
                  <span className="product-price">Tzs {parseInt(product.price).toLocaleString()}</span>
                  <span className="product-unit">
                    {product.category === 'Equipment' ? 'per unit' : 'per kg'}
                  </span>
                </div>
                
                <div className="product-details">
                  <span className="minimum-order">
                    Min Order: {product.minimum_order || 'Contact supplier'}
                  </span>
                </div>
                
                <div className="product-stock">
                  <span className={`stock-indicator ${product.stock > 50 ? 'in-stock' : 'low-stock'}`}>
                    {product.stock > 50 ? '✅ In Stock' : '⚠️ Limited Stock'}
                  </span>
                </div>
              </div>
              
              <div className="product-actions">
                  <button
                  className="view-details-btn"
                    onClick={() => console.log('View details button clicked')}
                >
                  View Details
                </button>
                  <button
                  className="contact-supplier-btn"
                    onClick={() => console.log('Contact info button clicked')}
                >
                    Contact Info
                </button>
                  <button
                  className="add-to-cart-btn"
                    onClick={() => console.log('Add to cart button clicked')}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust & Safety Section */}
      <div className="trust-section">
        <h2>🛡️ Trade with Confidence</h2>
        <div className="trust-features">
          <div className="trust-item">
            <div className="trust-icon">🔒</div>
            <h4>Secure Payments</h4>
            <p>Protected transactions with escrow service</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon">✅</div>
            <h4>Verified Suppliers</h4>
            <p>All farmers and suppliers are background checked</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon">🚛</div>
            <h4>Logistics Support</h4>
            <p>Nationwide delivery and logistics solutions</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon">💬</div>
            <h4>24/7 Support</h4>
            <p>Always here to help with your trading needs</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;
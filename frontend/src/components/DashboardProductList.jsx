import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import '../styles/product.css';
import '../styles/Admin.css';
import '../styles/Dashboard.css';

import { 
  Grid, List, Plus, Search, Filter, MoreVertical, Edit3, Trash2, 
  Eye, TrendingUp, Package, Star, AlertCircle, CheckCircle, Clock,
  Download, Upload, RefreshCw, Settings, ChevronDown
} from 'lucide-react';

const DashboardProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [view, setView] = useState('grid'); // 'grid' or 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      if (parsedUser.role === 'farmer' || parsedUser.role === 'supplier') {
        fetchProducts(parsedUser.id, parsedUser.role);
      } else {
        setLoading(false);
      }
    }
  }, []);

  const fetchProducts = async (userId, role) => {
    setLoading(true);
    try {
      const response = await axios.get(`/products/products/?owner=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setProducts(response.data.results || []);
    } catch (err) {
      setError('Error loading your products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await axios.delete(`/products/products/${productId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setProducts(products.filter(p => p.id !== productId));
    } catch (err) {
      setError('Failed to delete product');
      console.error('Error deleting product:', err);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) return;
    
    try {
      const deletePromises = selectedProducts.map(id =>
        axios.delete(`/products/products/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
      );
      
      await Promise.all(deletePromises);
      setProducts(products.filter(p => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
      setShowBulkActions(false);
    } catch (err) {
      setError('Failed to delete selected products');
      console.error('Error deleting products:', err);
    }
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => {
      const updated = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      setShowBulkActions(updated.length > 0);
      return updated;
    });
  };

  const selectAllProducts = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
      setShowBulkActions(false);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
      setShowBulkActions(true);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <CheckCircle className="status-icon active" />;
      case 'inactive':
        return <AlertCircle className="status-icon inactive" />;
      case 'pending':
        return <Clock className="status-icon pending" />;
      default:
        return <Package className="status-icon default" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-default';
    }
  };

  // Filter and search products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || product.status?.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'status':
        return a.status?.localeCompare(b.status || '') || 0;
      case 'recent':
      default:
        return new Date(b.created_at || b.updated_at || 0) - new Date(a.created_at || a.updated_at || 0);
    }
  });

  if (loading) {
    return (
      <div className="alibaba-products-page">
        <div className="loading-container">
          <RefreshCw className="loading-icon spinning" />
          <p>Loading your products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alibaba-products-page">
        <div className="error-container">
          <AlertCircle className="error-icon" />
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            <RefreshCw className="btn-icon" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="alibaba-products-page">
      {/* Page Header */}
      <div className="products-header">
        <div className="header-left">
          <h1 className="page-title">Your Products</h1>
          <p className="page-subtitle">
            Manage your {user?.role === 'farmer' ? 'crop listings' : 'product catalog'} and track performance
          </p>
        </div>
        <div className="header-actions">
          <Link to="/products/add" className="add-product-btn primary">
            <Plus className="btn-icon" />
            Add Product
          </Link>
          <button className="header-btn secondary">
            <Download className="btn-icon" />
            Export
          </button>
          <button className="header-btn secondary">
            <Upload className="btn-icon" />
            Import
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="bulk-actions-bar">
          <div className="bulk-info">
            <span>{selectedProducts.length} products selected</span>
          </div>
          <div className="bulk-actions">
            <button className="bulk-btn" onClick={handleBulkDelete}>
              <Trash2 className="btn-icon" />
              Delete Selected
            </button>
            <button className="bulk-btn">
              <Edit3 className="btn-icon" />
              Bulk Edit
            </button>
            <button className="bulk-btn" onClick={() => {
              setSelectedProducts([]);
              setShowBulkActions(false);
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div className="controls-bar">
        <div className="controls-left">
          {/* Search */}
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Filters */}
          <div className="filter-container">
            <button 
              className={`filter-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="btn-icon" />
              Filters
              <ChevronDown className={`dropdown-icon ${showFilters ? 'rotated' : ''}`} />
            </button>
          </div>

          {/* Sort */}
          <div className="sort-container">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="recent">Recently Added</option>
              <option value="name">Name A-Z</option>
              <option value="price">Price Low-High</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        <div className="controls-right">
          {/* View Toggle */}
          <div className="view-toggle">
            <button 
              className={`view-btn ${view === 'grid' ? 'active' : ''}`}
              onClick={() => setView('grid')}
              title="Grid View"
            >
              <Grid className="view-icon" />
            </button>
            <button 
              className={`view-btn ${view === 'table' ? 'active' : ''}`}
              onClick={() => setView('table')}
              title="Table View"
            >
              <List className="view-icon" />
            </button>
          </div>

          {/* Results Count */}
          <div className="results-count">
            {sortedProducts.length} of {products.length} products
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Status:</label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="filter-actions">
            <button 
              onClick={() => {
                setFilterStatus('all');
                setSearchTerm('');
                setSortBy('recent');
              }}
              className="clear-filters-btn"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Products Content */}
      <div className="products-content">
        {sortedProducts.length === 0 ? (
          <div className="empty-state">
            <Package className="empty-icon" />
            <h3>No products found</h3>
            <p>
              {products.length === 0 
                ? "You haven't added any products yet. Start by creating your first product listing."
                : "No products match your current filters. Try adjusting your search or filter criteria."
              }
            </p>
            <Link to="/products/add" className="add-first-product-btn">
              <Plus className="btn-icon" />
              Add Your First Product
            </Link>
          </div>
        ) : view === 'grid' ? (
          <div className="products-grid">
            {sortedProducts.map((product) => (
              <div key={product.id} className="product-card modern">
                <div className="card-header">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => toggleProductSelection(product.id)}
                    className="product-checkbox"
                  />
                  <div className="product-status">
                    {getStatusIcon(product.status)}
                    <span className={`status-text ${getStatusColor(product.status)}`}>
                      {product.status || 'Active'}
                    </span>
                  </div>
                  <div className="card-menu">
                    <MoreVertical className="menu-icon" />
                  </div>
                </div>

                <div className="product-image">
                  <img 
                    src={product.image || '/api/placeholder/300/200'} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = '/api/placeholder/300/200';
                    }}
                  />
                  <div className="image-overlay">
                    <button className="overlay-btn">
                      <Eye className="btn-icon" />
                      Quick View
                    </button>
                  </div>
                </div>

                <div className="card-content">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-description">
                    {product.description?.substring(0, 100)}
                    {product.description?.length > 100 && '...'}
                  </p>
                  
                  <div className="product-metrics">
                    <div className="metric">
                      <span className="metric-label">Price:</span>
                      <span className="metric-value">${product.price}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Views:</span>
                      <span className="metric-value">{product.views || '0'}</span>
                    </div>
                    {product.rating && (
                      <div className="metric rating">
                        <Star className="star-icon filled" />
                        <span className="metric-value">{product.rating}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card-actions">
                  <Link to={`/products/edit/${product.id}`} className="action-btn edit">
                    <Edit3 className="btn-icon" />
                    Edit
                  </Link>
                  <button className="action-btn analytics">
                    <TrendingUp className="btn-icon" />
                    Analytics
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)} 
                    className="action-btn delete"
                  >
                    <Trash2 className="btn-icon" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="products-table-container">
            <table className="products-table modern">
              <thead>
                <tr>
                  <th className="checkbox-column">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={selectAllProducts}
                      className="select-all-checkbox"
                    />
                  </th>
                  <th className="product-column">Product</th>
                  <th className="status-column">Status</th>
                  <th className="price-column">Price</th>
                  <th className="metrics-column">Performance</th>
                  <th className="date-column">Last Updated</th>
                  <th className="actions-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((product) => (
                  <tr key={product.id} className="table-row">
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                        className="row-checkbox"
                      />
                    </td>
                    <td className="product-cell">
                      <div className="product-info">
                        <img 
                          src={product.image || '/api/placeholder/60/60'} 
                          alt={product.name}
                          className="product-thumb"
                          onError={(e) => {
                            e.target.src = '/api/placeholder/60/60';
                          }}
                        />
                        <div className="product-details">
                          <h4 className="product-name">{product.name}</h4>
                          <p className="product-sku">SKU: {product.sku || product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="status-cell">
                      <div className="status-badge">
                        {getStatusIcon(product.status)}
                        <span className={getStatusColor(product.status)}>
                          {product.status || 'Active'}
                        </span>
                      </div>
                    </td>
                    <td className="price-cell">
                      <span className="price">${product.price}</span>
                    </td>
                    <td className="metrics-cell">
                      <div className="performance-metrics">
                        <div className="metric-item">
                          <Eye className="metric-icon" />
                          <span>{product.views || '0'}</span>
                        </div>
                        {product.rating && (
                          <div className="metric-item">
                            <Star className="metric-icon" />
                            <span>{product.rating}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="date-cell">
                      {new Date(product.updated_at || product.created_at).toLocaleDateString()}
                    </td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <Link to={`/products/edit/${product.id}`} className="table-action-btn edit">
                          <Edit3 className="btn-icon" />
                        </Link>
                        <button className="table-action-btn analytics">
                          <TrendingUp className="btn-icon" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)} 
                          className="table-action-btn delete"
                        >
                          <Trash2 className="btn-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardProductList;
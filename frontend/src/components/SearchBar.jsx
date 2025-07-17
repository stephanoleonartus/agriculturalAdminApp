import React, { useState, useEffect, useRef } from 'react';
import axios from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/SearchBar.css'; // Import the CSS file

const SearchBar = ({ onSearch }) => {
  const [activeTab, setActiveTab] = useState('Products'); // Products, Farmers, Suppliers
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(`auth/search/recommendations/?q=${searchTerm}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
      }
      setLoading(false);
    };

    const debounceFetch = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setSearchTerm('');
    setSuggestions([]);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      navigate(`/products/products?search=${searchTerm}`);
    }
  };

  const getTabStyle = (tabName) => {
    let style = {
      padding: '10px 20px',
      cursor: 'pointer',
      border: '1px solid #ccc',
      borderBottom: 'none',
      marginRight: '5px',
      borderRadius: '5px 5px 0 0',
      fontWeight: activeTab === tabName ? 'bold' : 'normal',
      backgroundColor: '#f0f0f0', // Default background
    };

    if (activeTab === tabName) {
      switch (tabName) {
        case 'Products':
          style.backgroundColor = 'darkgreen'; // Dark Green
          style.color = 'white';
          break;
        case 'Farmers':
          style.backgroundColor = 'green'; // Green
          style.color = 'white';
          break;
        case 'Suppliers':
          style.backgroundColor = 'orange'; // Orange
          style.color = 'white';
          break;
        default:
          break;
      }
    }
    return style;
  };

  return (
    <div className="search-bar-container" ref={searchContainerRef}>
      <div className="search-tabs">
        <div
          style={getTabStyle('Products')}
          onClick={() => handleTabClick('Products')}
          className={`search-tab ${activeTab === 'Products' ? 'active' : ''}`}
        >
          Products
        </div>
        <div
          style={getTabStyle('Farmers')}
          onClick={() => handleTabClick('Farmers')}
          className={`search-tab ${activeTab === 'Farmers' ? 'active' : ''}`}
        >
          Farmers
        </div>
        <div
          style={getTabStyle('Suppliers')}
          onClick={() => handleTabClick('Suppliers')}
          className={`search-tab ${activeTab === 'Suppliers' ? 'active' : ''}`}
        >
          Suppliers
        </div>
      </div>
      <form onSubmit={handleSearch} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div className="search-input-container">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder={`Search for ${activeTab}...`}
          />
          <button type="submit">
            Search
          </button>
        </div>
      </form>
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="suggestion-item">
              <Link to={`/${suggestion.type.toLowerCase()}/${suggestion.id}`}>
                {suggestion.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;

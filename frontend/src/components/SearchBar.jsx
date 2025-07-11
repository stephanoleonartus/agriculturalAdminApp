import React, { useState } from 'react';
import '../styles/SearchBar.css'; // Import the CSS file

const SearchBar = () => {
  const [activeTab, setActiveTab] = useState('Products'); // Products, Farmers, Suppliers
  const [searchTerm, setSearchTerm] = useState('');

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    // Potentially clear search term or trigger a new search context
    console.log(`Switched to ${tabName} tab`);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    // TODO: Implement search logic (e.g., navigate to results page or call API)
    console.log(`Searching for "${searchTerm}" in category "${activeTab}"`);
    // For now, just logging. Later this will trigger navigation or API calls.
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

  const searchBarContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  };

  const tabsContainerStyle = {
    display: 'flex',
    marginBottom: '0px', // Tabs will sit directly on top of the input container
  };

  const inputContainerStyle = {
    display: 'flex',
    width: '100%',
    maxWidth: '700px', // Max width for the search bar itself
    border: `2px solid ${activeTab === 'Products' ? 'darkgreen' : activeTab === 'Farmers' ? 'green' : 'orange'}`,
    borderRadius: '0 6px 6px 6px', // Rounded corners except top-left if tabs are flush
    overflow: 'hidden', // Ensures button stays within rounded corners
  };


  return (
    <div style={searchBarContainerStyle} className="search-bar-container">
      <div style={tabsContainerStyle} className="search-tabs">
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
      <form onSubmit={handleSearch} style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
        <div style={inputContainerStyle} className="search-input-container">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder={`Search for ${activeTab}...`}
            style={{
                flexGrow: 1,
                padding: '12px 15px',
                border: 'none',
                outline: 'none',
                fontSize: '16px'
            }}
          />
          <button type="submit" style={{
            padding: '10px 20px',
            border: 'none',
            backgroundColor: activeTab === 'Products' ? 'darkgreen' : activeTab === 'Farmers' ? 'green' : 'orange',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px'
          }}>
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;

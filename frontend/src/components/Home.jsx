import React, { useState } from "react";
import "../styles/home.css";
import Navigation from "./Navigation";

const items = [
  "Fresh Apples",
  "Organic Bananas",
  "Red Tomatoes",
  "Baby Carrots",
  "Crisp Cabbage",
  "Golden Potatoes",
  "Sweet Oranges",
];

const cardData = [
  {
    title: "Fresh Apples",
    price: "Tzs 2000 / kg",
    src: "/apple.png",
  },
  {
    title: "Organic Bananas",
    price: "Tzs 3000 / kg",
    src: "/bananas.png",
  },
  {
    title: "Tomatoes Pack",
    price: "Tzs 10000 / box",
    src: "/tomatoPack.png",
  },
  {
    title: "Carrots (Bulk)",
    price: "Tzs 4000 / kg",
    src: "/carrotBulk.png",
  },
  {
    title: "Cabbage Heads",
    price: "Tzs 2000 each",
    src: "/cabbage.png",
  },
  {
    title: "Potatoes Sacks",
    price: "Tzs 1000 / 5kg",
    src: "/potatoesSack.png",
  },
];

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

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

  return (
    <div className="home-container">
      {/* <Navigation /> */}

      {/* Welcome message */}
      <div className="welcome-msg">Welcome to AgriLink.com, Stephano</div>

      {/* Search Bar */}
      <div className="search-section">
        <input
          type="text"
          placeholder="🔍 Search farm products..."
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => setShowDropdown(searchTerm.trim() !== "")}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          className="search-input"
        />
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

      {/* Product Cards */}
      <div className="product-grid">
        {cardData.map((card, index) => (
          <div className="product-card" key={index}>
            <img src={card.src} alt={card.title} className="product-image" />
            <h3 className="product-title">{card.title}</h3>
            <p className="product-price">{card.price}</p>
            <button className="buy-button">View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;

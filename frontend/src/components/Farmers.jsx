// Farmers.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
// import AddFarmerForm from "./AddFarmerForm"; // Assuming this is not primary for this view now
import FarmerCard from "./FarmerCard";
import '../styles/farmers.css';

// Copied from Signup.jsx - ideally, this would be a shared constant
const regionOptions = [
    { value: "", label: "All Regions" }, // Added "All Regions"
    { value: "arusha", label: "Arusha" },
    { value: "dar_es_salaam", label: "Dar es Salaam" },
    { value: "dodoma", label: "Dodoma" },
    { value: "geita", label: "Geita" },
    { value: "iringa", label: "Iringa" },
    { value: "kagera", label: "Kagera" },
    { value: "katavi", label: "Katavi" },
    { value: "kigoma", label: "Kigoma" },
    { value: "kilimanjaro", label: "Kilimanjaro" },
    { value: "lindi", label: "Lindi" },
    { value: "manyara", label: "Manyara" },
    { value: "mara", label: "Mara" },
    { value: "mbeya", label: "Mbeya" },
    { value: "morogoro", label: "Morogoro" },
    { value: "mtwara", label: "Mtwara" },
    { value: "mwanza", label: "Mwanza" },
    { value: "njombe", label: "Njombe" },
    { value: "pwani", label: "Pwani" },
    { value: "rukwa", label: "Rukwa" },
    { value: "ruvuma", label: "Ruvuma" },
    { value: "shinyanga", label: "Shinyanga" },
    { value: "simiyu", label: "Simiyu" },
    { value: "singida", label: "Singida" },
    { value: "songwe", label: "Songwe" },
    { value: "tabora", label: "Tabora" },
    { value: "tanga", label: "Tanga" },
    { value: "zanzibar", label: "Zanzibar" },
];

function Farmers() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('');

  useEffect(() => {
    const fetchFarmers = async () => {
      setLoading(true);
      setError(null);
      try {
        let apiUrl = "http://localhost:8000/api/accounts/farmers/";
        const params = new URLSearchParams();
        if (selectedRegion) {
          params.append('region', selectedRegion);
        }
        // TODO: Add other filters like search term, pagination params here

        const fullApiUrl = `${apiUrl}?${params.toString()}`;
        const response = await axios.get(fullApiUrl);

        if (response.data && Array.isArray(response.data.results)) {
          setFarmers(response.data.results);
          // TODO: set pagination data
        } else if (Array.isArray(response.data)) { // Fallback for non-paginated
            setFarmers(response.data);
        } else {
            console.warn("Unexpected farmer data structure:", response.data);
            setFarmers([]);
        }
      } catch (err) {
        console.error("Error fetching farmers:", err);
        setError(err.message || "Failed to fetch farmers.");
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, [selectedRegion]); // Re-fetch when selectedRegion changes

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  // The AddFarmerForm might be part of an admin/farmer dashboard rather than public listing
  // For now, I'm commenting it out from this public listing page.
  // <AddFarmerForm setFarmers={setFarmers} />

  return (
    <div className="farmers-page">
      <h1>👨‍🌾 Meet Our Farmers</h1>

      <div className="filters-container" style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label htmlFor="region-filter" style={{ marginRight: '10px' }}>Filter by Region:</label>
        <select id="region-filter" value={selectedRegion} onChange={handleRegionChange}>
          {regionOptions.map(region => (
            <option key={region.value} value={region.value}>
              {region.label}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading farmers...</p>}
      {!loading && error && <p>Error: {error}</p>}
      {!loading && !error && farmers.length === 0 && <p>No farmers found for the selected criteria.</p>}

      <div className="farmer-list">
        {farmers.map((farmer) => (
          <FarmerCard key={farmer.id} farmer={farmer} />
        ))}
      </div>
    </div>
  );
}

export default Farmers;

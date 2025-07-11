// Supplies.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import SupplierCard from "./SupplierCard";
import "../styles/Supplies.css"; // Ensure this CSS file exists or is created

// Reusing regionOptions, ideally from a shared constants file
const regionOptions = [
    { value: "", label: "All Regions" },
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

function Supplies() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('');

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      setError(null);
      try {
        let apiUrl = "http://localhost:8000/api/accounts/suppliers/";
        const params = new URLSearchParams();
        if (selectedRegion) {
          params.append('region', selectedRegion);
        }
        // TODO: Add other filters like search term, pagination params here

        const fullApiUrl = `${apiUrl}?${params.toString()}`;
        const response = await axios.get(fullApiUrl);

        if (response.data && Array.isArray(response.data.results)) {
          setSuppliers(response.data.results);
          // TODO: set pagination data
        } else if (Array.isArray(response.data)) { // Fallback for non-paginated
            setSuppliers(response.data);
        } else {
            console.warn("Unexpected supplier data structure:", response.data);
            setSuppliers([]);
        }
      } catch (err) {
        console.error("Error fetching suppliers:", err);
        setError(err.message || "Failed to fetch suppliers.");
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, [selectedRegion]); // Re-fetch when selectedRegion changes

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  return (
    <div className="supplies-page">
      <h1>🏭 Suppliers Directory</h1>

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

      {loading && <p>Loading suppliers...</p>}
      {!loading && error && <p>Error: {error}</p>}
      {!loading && !error && suppliers.length === 0 && <p>No suppliers found for the selected criteria.</p>}

      <div className="supplier-list"> {/* Ensure this class is styled in Supplies.css */}
        {suppliers.map((supplier) => (
          <SupplierCard key={supplier.id} supplier={supplier} />
        ))}
      </div>
    </div>
  );
}

export default Supplies;

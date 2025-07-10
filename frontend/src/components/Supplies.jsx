// Supplies.jsx
import React, { useState, useEffect } from "react";
import SupplierCard from "./SupplierCard";
import "../styles/Supplies.css";

function Supplies() {
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    // Sample data - replace with Django API later
    const sampleData = [
      {
        region: "Arusha",
        categories: {
          seeds: [
            { name: "Arusha Seed Co", contact: "+255 711 123 456" },
            { name: "Tanzania AgriSeeds", contact: "+255 762 111 222" }
          ],
          tools: [
            { name: "JembeMart", contact: "+255 713 987 654" }
          ],
          fertilizers: [],
          equipment: []
        }
      },
      {
        region: "Dodoma",
        categories: {
          seeds: [],
          tools: [],
          fertilizers: [
            { name: "Dodoma Fert Co", contact: "+255 755 555 111" }
          ],
          equipment: [
            { name: "AgriTools TZ", contact: "+255 700 111 333" }
          ]
        }
      }
    ];

    setRegions(sampleData);
  }, []);

  return (
    <div className="supplies-page">
      <h1>🌍 Regional Suppliers</h1>
      {regions.map((regionData, index) => (
        <div key={index} className="region-section">
          <h2>{regionData.region}</h2>
          {Object.entries(regionData.categories).map(([category, suppliers]) => (
            suppliers.length > 0 && (
              <div key={category} className="category-section">
                <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                <div className="supplier-list">
                  {suppliers.map((supplier, idx) => (
                    <SupplierCard key={idx} supplier={supplier} />
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      ))}
    </div>
  );
}

export default Supplies;

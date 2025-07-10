// Farmers.jsx
import React, { useState, useEffect } from "react";
import AddFarmerForm from "./AddFarmerForm";
import FarmerCard from "./FarmerCard";
import '../styles/farmers.css';

function Farmers() {
  const [farmers, setFarmers] = useState([]);

  // Fetch farmers (later from Django)
  useEffect(() => {
    // Placeholder data, replace with API fetch later
    const sampleFarmers = [
      {
        id: 1,
        name: "John Mwakyusa",
        region: "Mbeya",
        contact: "+255 712 345 678",
        products: {
          grains: ["Maize", "Beans"],
          fruits: ["Banana"],
          vegetables: ["Spinach"]
        }
      },
      {
        id: 2,
        name: "Asha Komba",
        region: "Morogoro",
        contact: "+255 765 000 111",
        products: {
          grains: ["Rice"],
          fruits: ["Mango", "Orange"],
          vegetables: []
        }
      }
    ];

    setFarmers(sampleFarmers);
  }, []);

  return (
    <div className="farmers-page">
      <h1>👨‍🌾 Meet Our Farmers</h1>

      <AddFarmerForm setFarmers={setFarmers} />

      <div className="farmer-list">
        {farmers.map((farmer) => (
          <FarmerCard key={farmer.id} farmer={farmer} />
        ))}
      </div>
    </div>
  );
}

export default Farmers;

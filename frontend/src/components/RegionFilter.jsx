import React, { useRef, useState, useEffect } from 'react';
import axios from '../api/axios';
import '../styles/RegionFilter.css';

const RegionFilter = ({ onRegionFilter }) => {
  const [regions, setRegions] = useState([]);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get('/auth/regions/');
        setRegions(response.data || []);
      } catch (err) {
        console.error('Error fetching regions:', err);
      }
    };
    fetchRegions();
  }, []);

  const scroll = (scrollOffset) => {
    menuRef.current.scrollLeft += scrollOffset;
  };

  return (
    <div className="region-filter-wrapper">
      <button className="scroll-btn left" onClick={() => scroll(-100)}>
        &lt;
      </button>
      <div className="region-filter" ref={menuRef}>
        <ul className="region-list">
          <li onClick={() => onRegionFilter('')}>All Regions</li>
          {regions.map((region) => (
            <li key={region.id} onClick={() => onRegionFilter(region.name)}>
              {region.name}
            </li>
          ))}
        </ul>
      </div>
      <button className="scroll-btn right" onClick={() => scroll(100)}>
        &gt;
      </button>
    </div>
  );
};

export default RegionFilter;

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsHidden(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="home-container">
    </div>
  );
};

export default Home;
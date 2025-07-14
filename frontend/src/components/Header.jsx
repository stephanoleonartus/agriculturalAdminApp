import React, { useState, useEffect } from 'react';
import TopHeader from './TopHeader';
import CategoryNav from './CategoryNav';
import '../styles/Header.css';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
                document.body.classList.add('scrolled');
            } else {
                setIsScrolled(false);
                document.body.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
            <TopHeader />
            <CategoryNav />
        </header>
    );
};

export default Header;

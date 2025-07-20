import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TopHeader from './TopHeader';
import Navigation from './Navigation';
import CategoryNav from './CategoryNav';
import '../styles/Header.css';

const MainLayout = () => {
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
        <div className="main-layout">
            <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
                <TopHeader />
                <Navigation />
                <CategoryNav />
            </header>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;

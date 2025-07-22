import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TopHeader from './TopHeader';
import Navigation from './Navigation';
import CategoryNav from './CategoryNav';
import '../styles/Header.css';

const MainLayout = () => {
    return (
        <div className="main-layout">
            <header className="main-header">
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

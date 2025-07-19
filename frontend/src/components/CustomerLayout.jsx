import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const CustomerLayout = () => {
  return (
    <div className="customer-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;

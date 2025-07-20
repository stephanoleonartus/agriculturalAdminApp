import React from 'react';
import { Outlet } from 'react-router-dom';
import MainLayout from './MainLayout';

const DashboardLayout = () => {
  return (
    <MainLayout>
      <div className="dashboard-content">
        <Outlet />
      </div>
    </MainLayout>
  );
};

export default DashboardLayout;

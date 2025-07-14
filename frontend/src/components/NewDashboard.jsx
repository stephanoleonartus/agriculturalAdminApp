import React, { useState } from 'react';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import EngagementInsights from './EngagementInsights';
import '../styles/Dashboard.css';

const NewDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'insights':
        return <EngagementInsights />;
      default:
        return <ProductManagement />;
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-nav">
        <button
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={activeTab === 'insights' ? 'active' : ''}
          onClick={() => setActiveTab('insights')}
        >
          Insights
        </button>
      </div>
      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default NewDashboard;

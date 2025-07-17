import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import Card from './Card';
import Widget from './Widget';
import Chart from './Chart';
import '../styles/AccountDetail.css';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('auth/profile/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('analytics/dashboard-stats/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchUser();
    fetchDashboardData();
  }, []);

  return (
    <div className="account-detail-container">
      <div className="account-detail">
        <div className="header">
          <div className="profile-photo">
            <img src={user?.profile_picture || "https://via.placeholder.com/150"} alt="Profile" />
            <a href="#">Upload Photo</a>
          </div>
          <div className="vertical-line"></div>
          <div className="account-info">
            <h3>{user?.username} ({user?.role})</h3>
            <p>Email: {user?.email} <a href="#">Change email address</a></p>
            <p>Mobile: {user?.phone_number || 'N/A'} <a href="#">Change Mobile number</a></p>
          </div>
        </div>
        <div className="body">
          <div className="section">
            {dashboardData && (
              <>
                <div className="widgets">
                  {dashboardData.widgets.map((widget, index) => (
                    <Widget key={index} title={widget.title} value={widget.value} />
                  ))}
                </div>
                <Card title="Sales">
                  <Chart data={dashboardData.chartData} />
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import Chart from './Chart';

const Analytics = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [salesAnalytics, setSalesAnalytics] = useState([]);
  const [userAnalytics, setUserAnalytics] = useState([]);
  const [analyticsEvents, setAnalyticsEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get('/api/v1/analytics/dashboard-stats/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });
        setDashboardStats(statsRes.data);

        const salesRes = await axios.get('/api/v1/analytics/sales/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });
        setSalesAnalytics(salesRes.data.results);

        const usersRes = await axios.get('/api/v1/analytics/users/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });
        setUserAnalytics(usersRes.data.results);

        const eventsRes = await axios.get('/api/v1/analytics/events/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });
        setAnalyticsEvents(eventsRes.data.results);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Analytics</h2>
      {dashboardStats && (
        <div>
          <h3>Dashboard Stats</h3>
          <p>Total Farmers: {dashboardStats.total_farmers}</p>
          <p>Total Products: {dashboardStats.total_products}</p>
          <p>Total Orders: {dashboardStats.total_orders}</p>
          <p>Total Suppliers: {dashboardStats.total_suppliers}</p>
        </div>
      )}
      {salesAnalytics.length > 0 && (
        <div>
          <h3>Sales Analytics</h3>
          <Chart data={{
            labels: salesAnalytics.map(s => s.date),
            values: salesAnalytics.map(s => s.total_revenue)
          }} />
        </div>
      )}
      {userAnalytics.length > 0 && (
        <div>
          <h3>User Analytics</h3>
          <ul>
            {userAnalytics.map(user => (
              <li key={user.id}>{user.username}: {user.total_orders} orders</li>
            ))}
          </ul>
        </div>
      )}
      {analyticsEvents.length > 0 && (
        <div>
          <h3>Analytics Events</h3>
          <ul>
            {analyticsEvents.map(event => (
              <li key={event.id}>{event.event_type} at {event.created_at}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Analytics;

import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import '../styles/Chart.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Chart = ({ data }) => {
  const [chartType, setChartType] = useState('line');

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Sales',
        data: data.values,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options to ensure proper cleanup
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Chart',
      },
    },
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'bar':
        return <Bar data={chartData} options={options} />;
      case 'pie':
        return <Pie data={chartData} options={options} />;
      default:
        return null;
    }
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Sales Chart</h3>
        <div className="chart-options">
          <button 
            onClick={() => setChartType('line')}
            className={chartType === 'line' ? 'active' : ''}
          >
            Line
          </button>
          <button 
            onClick={() => setChartType('bar')}
            className={chartType === 'bar' ? 'active' : ''}
          >
            Bar
          </button>
          <button 
            onClick={() => setChartType('pie')}
            className={chartType === 'pie' ? 'active' : ''}
          >
            Pie
          </button>
        </div>
      </div>
      <div className="chart-body">
        {renderChart()}
      </div>
    </div>
  );
};

export default Chart;
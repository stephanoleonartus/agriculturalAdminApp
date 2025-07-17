import React, { useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import '../styles/Chart.css';

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

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={chartData} />;
      case 'bar':
        return <Bar data={chartData} />;
      case 'pie':
        return <Pie data={chartData} />;
      default:
        return null;
    }
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Sales Chart</h3>
        <div className="chart-options">
          <button onClick={() => setChartType('line')}>Line</button>
          <button onClick={() => setChartType('bar')}>Bar</button>
          <button onClick={() => setChartType('pie')}>Pie</button>
        </div>
      </div>
      <div className="chart-body">
        {renderChart()}
      </div>
    </div>
  );
};

export default Chart;

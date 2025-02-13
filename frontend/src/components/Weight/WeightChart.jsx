import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import './styles/WeightChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeightChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "体重",
        data: [],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/weights`);
        const weights = response.data;

        console.log("Fetched weights data:", weights); // デバッグ用

        if (weights && weights.length > 0) {
          const dates = weights.map(weight => weight.date);
          const weightValues = weights.map(weight => weight.weight);

          setChartData({
            labels: dates,
            datasets: [
              {
                label: "体重",
                data: weightValues,
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                fill: true,
              },
            ],
          });
        } else {
          console.warn("No weight data available");
        }
      } catch (error) {
        console.error("Error fetching weight data:", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: '日付',
          font: {
            size: 20, // フォントサイズを調整
          },
          className: 'weight-x-axis-title', // クラス名を追加
        },
        ticks: {
          font: {
            size: 16, // フォントサイズを調整
          },
          className: 'weight-x-axis-ticks', // クラス名を追加
        },
      },
      y: {
        title: {
          display: true,
          text: '体重 (kg)',
          font: {
            size: 16, // フォントサイズを調整
          },
          className: 'weight-y-axis-title', // クラス名を追加
        },
        ticks: {
          font: {
            size: 16, // フォントサイズを調整
          },
          className: 'weight-y-axis-ticks', // クラス名を追加
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 16, // フォントサイズを調整
          },
          className: 'weight-legend-labels', // クラス名を追加
        },
      },
      tooltip: {
        titleFont: {
          size: 16, // フォントサイズを調整
        },
        bodyFont: {
          size: 12, // フォントサイズを調整
        },
        className: 'weight-tooltip', // クラス名を追加
      },
    },
  };

  return (
    <div className="weight-chart-container">
      <h2 className="weight-chart-title">体重推移</h2>
      <div className="weight-chart-wrapper">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default WeightChart;
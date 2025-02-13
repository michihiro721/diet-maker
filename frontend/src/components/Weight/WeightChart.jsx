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
      },
    ],
  });
  const [period, setPeriod] = useState('7days'); // デフォルトの期間を7日間に設定

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/weights`);
        const weights = response.data;

        console.log("Fetched weights data:", weights); // デバッグ用

        if (weights && weights.length > 0) {
          let filteredWeights;
          const now = new Date();

          switch (period) {
            case '7days':
              filteredWeights = weights.slice(-7);
              break;
            case '1month':
              filteredWeights = weights.filter(weight => {
                const date = new Date(weight.date);
                return (now - date) / (1000 * 60 * 60 * 24) <= 30;
              });
              break;
            case '2months':
              filteredWeights = weights.filter(weight => {
                const date = new Date(weight.date);
                return (now - date) / (1000 * 60 * 60 * 24) <= 60;
              });
              break;
            case '3months':
              filteredWeights = weights.filter(weight => {
                const date = new Date(weight.date);
                return (now - date) / (1000 * 60 * 60 * 24) <= 90;
              });
              break;
            case 'all':
              filteredWeights = weights;
              break;
            default:
              filteredWeights = weights.slice(-7);
          }

          const dates = filteredWeights.map(weight => {
            const date = new Date(weight.date);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          });
          const weightValues = filteredWeights.map(weight => weight.weight);

            setChartData({
            labels: dates,
            datasets: [
              {
              label: "体重",
              data: weightValues,
              borderColor: "rgba(0, 123, 255, 0.5)",
              backgroundColor: "rgba(0, 123, 255, 0.2)",
              pointBackgroundColor: "rgba(0, 123, 255, 1)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgba(0, 123, 255, 1)",
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
  }, [period]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: '（日付）',
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
          text: '(kg)',
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
        display: false, // 凡例を非表示にする
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
      <div className="weight-chart-controls">
        <label htmlFor="period-select">表示期間:</label>
        <select
          id="period-select"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="7days">直近7日</option>
          <option value="1month">直近1ヶ月</option>
          <option value="2months">直近2ヶ月</option>
          <option value="3months">直近3ヶ月</option>
          <option value="all">すべて</option>
        </select>
      </div>
      <div className="weight-chart-wrapper">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default WeightChart;
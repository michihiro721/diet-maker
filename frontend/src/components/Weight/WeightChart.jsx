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
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
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
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
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

  return (
    <div>
      <h2>体重推移</h2>
      <Line data={chartData} />
    </div>
  );
};

export default WeightChart;
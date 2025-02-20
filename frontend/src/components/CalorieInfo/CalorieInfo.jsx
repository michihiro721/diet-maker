import React, { useState, useEffect } from "react";
import './styles/calorie-info.css';
import CalendarModal from '../Home/Body/Calender/Calender';
import WeightModal from '../Weight/WeightModal';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const CalorieInfo = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [steps, setSteps] = useState(0);
  const [trainingCalories, setTrainingCalories] = useState(0);
  const [basalMetabolism, setBasalMetabolism] = useState(0);
  const [intakeCalories, setIntakeCalories] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    fetchChartData();
  }, [selectedDate]);

  const fetchChartData = async () => {
    try {
      const formattedDate = selectedDate.toLocaleDateString('en-CA');
      const response = await axios.get(`https://diet-maker-d07eb3099e56.herokuapp.com/calories?date=${formattedDate}`);
      const data = response.data;

      console.log("API Response:", data); // デバッグ用

      // データが undefined, null, 配列でない場合のチェック
      if (!Array.isArray(data)) {
        throw new Error("Invalid API response format");
      }

      const labels = data.map(entry => entry.date);
      const totalCalories = data.map(entry => entry.total_calories);
      const intakeCalories = data.map(entry => entry.calories);
      const steps = data.map(entry => entry.steps);

      setChartData({
        labels,
        datasets: [
          {
            label: '合計消費カロリー',
            data: totalCalories,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
          },
          {
            label: '摂取カロリー',
            data: intakeCalories,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
          },
          {
            label: '歩数',
            data: steps,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setChartData({ labels: [], datasets: [] }); // エラー時のデフォルトデータ
    }
  };

  const handleStepsChange = (value) => setSteps(value);
  const handleTrainingCaloriesChange = (value) => setTrainingCalories(value);
  const handleBasalMetabolismChange = (value) => setBasalMetabolism(value);
  const handleIntakeCaloriesChange = (value) => setIntakeCalories(value);

  const calculateStepCalories = () => steps * 0.04; // 歩数 × 0.04 kcal/歩
  const totalCaloriesBurned = () => calculateStepCalories() + parseFloat(trainingCalories) + parseFloat(basalMetabolism);
  const calorieDifference = () => intakeCalories - totalCaloriesBurned();

  const openCalendarModal = () => setIsCalendarOpen(true);
  const closeCalendarModal = () => setIsCalendarOpen(false);

  const openWeightModal = (inputType) => {
    setCurrentInput(inputType);
    setIsWeightModalOpen(true);
  };

  const closeWeightModal = () => setIsWeightModalOpen(false);

  const handleWeightModalSave = (value) => {
    switch (currentInput) {
      case "steps":
        handleStepsChange(value);
        break;
      case "trainingCalories":
        handleTrainingCaloriesChange(value);
        break;
      case "basalMetabolism":
        handleBasalMetabolismChange(value);
        break;
      case "intakeCalories":
        handleIntakeCaloriesChange(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="calorie-info-container">
      <button className="calorie-date-button" onClick={openCalendarModal}>
        日付を選択
      </button>
      <h1 className="calorie-title">カロリー関係</h1>
      <div className="calorie-input-group">
        <label>歩数:</label>
        <input type="text" value={steps} readOnly onClick={() => openWeightModal("steps")} />
      </div>
      <div className="calorie-input-group">
        <label>トレーニングの消費カロリー:</label>
        <input type="text" value={trainingCalories} readOnly onClick={() => openWeightModal("trainingCalories")} />
      </div>
      <div className="calorie-input-group">
        <label>基礎代謝:</label>
        <input type="text" value={basalMetabolism} readOnly onClick={() => openWeightModal("basalMetabolism")} />
      </div>
      <div className="calorie-input-group">
        <label>1日の摂取カロリー:</label>
        <input type="text" value={intakeCalories} readOnly onClick={() => openWeightModal("intakeCalories")} />
      </div>
      <div className="calorie-summary">
        <p>歩数からの消費カロリー: {calculateStepCalories().toFixed(2)} kcal</p>
        <p>合計消費カロリー: {totalCaloriesBurned().toFixed(2)} kcal</p>
        <p>1日の摂取カロリー: {intakeCalories} kcal</p>
        <p>カロリー差分: {calorieDifference().toFixed(2)} kcal</p>
      </div>
      <div className="calorie-chart">
        {chartData.labels.length > 0 ? (
          <Line data={chartData} />
        ) : (
          <p>データがありません</p>
        )}
      </div>
      {isCalendarOpen && (
        <CalendarModal
          isOpen={isCalendarOpen}
          onClose={closeCalendarModal}
          onSave={setSelectedDate}
        />
      )}
      {isWeightModalOpen && (
        <WeightModal
          isOpen={isWeightModalOpen}
          onClose={closeWeightModal}
          onSave={handleWeightModalSave}
        />
      )}
    </div>
  );
};

export default CalorieInfo;
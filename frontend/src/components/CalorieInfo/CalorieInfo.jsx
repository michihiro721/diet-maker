import React, { useState, useEffect } from "react";
import './styles/calorie-info.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../Home/Body/Calender/styles/CalenderWeekdays.css'; // カレンダーのスタイルをインポート
import '../Home/Body/Calender/styles/CalenderNavigation.css'; // カレンダーのスタイルをインポート
import '../Home/Body/Calender/styles/CalenderDays.css'; // カレンダーのスタイルをインポート
import '../Home/Body/Calender/styles/CalenderCommon.css'; // カレンダーのスタイルをインポート
import CalenderFormatShortWeekday from "../Home/Body/Calender/CalenderFormatShortWeekday";
import CalenderTileClassName from "../Home/Body/Calender/CalenderTileClassName";
import CalenderTileContent from "../Home/Body/Calender/CalenderTileContent";
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
      const url = `https://diet-maker-d07eb3099e56.herokuapp.com/calories?date=${formattedDate}`;
      
      console.log("Fetching from URL:", url);
      const response = await axios.get(url);
      
      console.log("Full API Response:", response);
      console.log("Response Status:", response.status);
      console.log("Response Data Type:", typeof response.data);
      console.log("Response Data:", JSON.stringify(response.data, null, 2));
      
      const data = response.data;
      
      // 空のレスポンスチェック（空文字列や空白文字のみの場合も含む）
      if (!data || (typeof data === 'string' && data.trim() === '')) {
        console.log("Empty or whitespace-only response received");
        setChartData({ labels: [], datasets: [] });
        return;
      }

      // データが配列でない場合のチェック
      if (!Array.isArray(data)) {
        throw new Error("Invalid API response format");
      }
      
      // 以下は既存の処理...
      const chartLabels = data.map(entry => entry.date);
      const totalCaloriesData = data.map(entry => entry.total_calories);
      const intakeCaloriesData = data.map(entry => entry.calories);
      const stepsData = data.map(entry => entry.steps);
      
      setChartData({
        labels: chartLabels,
        datasets: [
          {
            label: '合計消費カロリー',
            data: totalCaloriesData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
          },
          {
            label: '摂取カロリー',
            data: intakeCaloriesData,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
          },
          {
            label: '歩数',
            data: stepsData,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching chart data:", error);
      console.error("Error details:", error.response || error.message);
      setChartData({ labels: [], datasets: [] });
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

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

  const handleSave = async () => {
    try {
      const formattedDate = selectedDate.toLocaleDateString('en-CA');
      const response = await axios.post('https://diet-maker-d07eb3099e56.herokuapp.com/save', {
        date: formattedDate,
        steps: steps,
        total_calories: totalCaloriesBurned(),
        intake_calories: intakeCalories,
      });
      console.log("Save response:", response);
      alert("データが保存されました");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("データの保存に失敗しました");
    }
  };

  return (
    <div className="calorie-info-container">
      <div className="calorie-input-group">
        <label>日付を選択:</label>
        <input
          type="text"
          value={selectedDate.toLocaleDateString()}
          readOnly
          onClick={openCalendarModal}
        />
      </div>
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
      <button className="calorie-save-button" onClick={handleSave}>保存</button>
      {isCalendarOpen && (
        <div className="calendar-modal-overlay" onClick={closeCalendarModal}>
          <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
            <Calendar
              onChange={handleDateChange}
              formatShortWeekday={CalenderFormatShortWeekday}
              tileClassName={CalenderTileClassName}
              tileContent={CalenderTileContent}
              value={selectedDate}
            />
          </div>
        </div>
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
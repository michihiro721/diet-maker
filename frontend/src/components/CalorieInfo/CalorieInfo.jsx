import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from 'axios';
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
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './styles/calorie-info.css';
import '../Home/Body/Calender/styles/CalenderWeekdays.css'; // カレンダーのスタイルをインポート
import '../Home/Body/Calender/styles/CalenderNavigation.css'; // カレンダーのスタイルをインポート
import '../Home/Body/Calender/styles/CalenderDays.css'; // カレンダーのスタイルをインポート
import '../Home/Body/Calender/styles/CalenderCommon.css'; // カレンダーのスタイルをインポート
import CalenderFormatShortWeekday from "../Home/Body/Calender/CalenderFormatShortWeekday";
import CalenderTileClassName from "../Home/Body/Calender/CalenderTileClassName";
import CalenderTileContent from "../Home/Body/Calender/CalenderTileContent";
import WeightModal from '../Weight/WeightModal';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
    datasets: [
      {
        label: '合計消費カロリー',
        data: [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        pointBackgroundColor: "rgba(255, 20, 147, 1)",
        fill: false,
        pointStyle: 'circle',
        pointRadius: 3,
      },
      {
        label: '摂取カロリー',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        pointBackgroundColor: "rgba(50, 150, 150, 1)",
        fill: false,
        pointStyle: 'circle',
        pointRadius: 3,
      },
      {
        label: '消費カロリー（歩き）',
        data: [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        pointBackgroundColor: "rgba(0, 123, 255, 1)",
        fill: false,
        pointStyle: 'circle',
        pointRadius: 3,
      },
    ],
  });

  const fetchData = async () => {
    try {
      const stepsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/steps`);
      const dailyCaloriesResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/daily_calories`);
      const intakeCaloriesResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/intake_calories`);

      const stepsData = stepsResponse.data.map(item => ({
        date: new Date(item.date).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' }), // グラフのラベルに表示する日付 表示方法：x/x
        value: item.calories_burned,
      }));

      const dailyCaloriesData = dailyCaloriesResponse.data.map(item => ({
        date: new Date(item.date).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' }), // グラフのラベルに表示する日付
        value: item.total_calories,
      }));

      const intakeCaloriesData = intakeCaloriesResponse.data.map(item => ({
        date: new Date(item.date).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' }), // グラフのラベルに表示する日付
        value: item.calories,
      }));

      setChartData({
        labels: stepsData.map(item => item.date),
        datasets: [
          {
            ...chartData.datasets[0],
            data: dailyCaloriesData.map(item => item.value),
          },
          {
            ...chartData.datasets[1],
            data: intakeCaloriesData.map(item => item.value),
          },
          {
            ...chartData.datasets[2],
            data: stepsData.map(item => item.value),
          },
        ],
      });
    } catch (error) {
      console.error('データの取得に失敗しました:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    setIsWeightModalOpen(false);
  };

  const handleDateChange = (date) => {
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    setSelectedDate(offsetDate.toISOString().split('T')[0]);
    setIsCalendarOpen(false);
  };

  const handleSave = async () => {
    if (!selectedDate || !steps || !trainingCalories || !basalMetabolism || !intakeCalories) {
      alert('全ての項目を入力してください');
      return;
    }

    const totalCalories = parseFloat(trainingCalories) + parseFloat(basalMetabolism) + (parseFloat(steps) * 0.04);

    try {
      const stepsResponse = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/steps`, {
        step: {
          user_id: 1, // ユーザーIDを追加
          date: selectedDate, // 選択された日付を送信
          steps: steps, // 歩数データを送信
          calories_burned: parseFloat(steps) * 0.04, // 歩数から計算した消費カロリーを送信
        }
      });

      const dailyCaloriesResponse = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/daily_calories`, {
        daily_calorie: {
          user_id: 1, // ユーザーIDを追加
          date: selectedDate, // 選択された日付を送信
          total_calories: totalCalories, // 合計消費カロリーを送信
        }
      });

      const intakeCaloriesResponse = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/intake_calories`, {
        intake_calorie: {
          user_id: 1, // ユーザーIDを追加
          date: selectedDate, // 選択された日付を送信
          calories: intakeCalories, // 1日の摂取カロリーを送信
        }
      });

      if (stepsResponse.status === 201 && dailyCaloriesResponse.status === 201 && intakeCaloriesResponse.status === 201) {
        console.log("Data saved successfully");
        // データを再取得してグラフを更新
        fetchData();
        alert('データの保存に成功しました');
      } else {
        console.error("Error saving data:", stepsResponse.data, dailyCaloriesResponse.data, intakeCaloriesResponse.data);
        alert('データの保存に失敗しました');
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert('データの保存に失敗しました');
    }
  };

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
          className: 'calorie-x-axis-title', // クラス名を追加
        },
        ticks: {
          font: {
            size: 16, // フォントサイズを調整
          },
          className: 'calorie-x-axis-ticks', // クラス名を追加
        },
      },
      y: {
        title: {
          display: true,
          text: '(kcal)',
          font: {
            size: 16, // フォントサイズを調整
          },
          className: 'calorie-y-axis-title', // クラス名を追加
        },
        ticks: {
          font: {
            size: 16, // フォントサイズを調整
          },
          className: 'calorie-y-axis-ticks', // クラス名を追加
        },
      },
    },
    plugins: {
      legend: {
        display: true, // 凡例を表示
      },
      tooltip: {
        titleFont: {
          size: 16, // フォントサイズを調整
        },
        bodyFont: {
          size: 12, // フォントサイズを調整
        },
        className: 'calorie-tooltip', // クラス名を追加
      },
    },
  };

  return (
    <div className="calorie-info-container">
      <div className="calorie-chart">
        <Line data={chartData} options={options} />
      </div>
      <div className="calorie-input-group">
        <label className="calorie-label">日付を選択:</label>
        <input
          type="text"
          value={selectedDate ? new Date(selectedDate).toLocaleDateString() : ''}
          readOnly
          onClick={openCalendarModal}
          className="calorie-input"
        />
      </div>
      <div className="calorie-input-group">
        <label className="calorie-label">歩数:</label>
        <input type="text" value={steps ? `${steps} 歩` : ''} readOnly onClick={() => openWeightModal("steps")} className="calorie-input" />
      </div>
      <div className="calorie-input-group">
        <label className="calorie-label">トレーニングの消費カロリー:</label>
        <input type="text" value={trainingCalories ? `${trainingCalories} kcal` : ''} readOnly onClick={() => openWeightModal("trainingCalories")} className="calorie-input" />
      </div>
      <div className="calorie-input-group">
        <label className="calorie-label">基礎代謝:</label>
        <input type="text" value={basalMetabolism ? `${basalMetabolism} kcal` : ''} readOnly onClick={() => openWeightModal("basalMetabolism")} className="calorie-input" />
      </div>
      <div className="calorie-input-group">
        <label className="calorie-label">1日の摂取カロリー:</label>
        <input type="text" value={intakeCalories ? `${intakeCalories} kcal` : ''} readOnly onClick={() => openWeightModal("intakeCalories")} className="calorie-input" />
      </div>
      <div className="calorie-summary">
        <p>歩数から計算した消費カロリー: {Math.round(calculateStepCalories() * 10) / 10} kcal</p>
        <p>合計消費カロリー: {Math.round(totalCaloriesBurned() * 10) / 10} kcal</p>
        <p>1日の摂取カロリー: {intakeCalories} kcal</p>
        <p>カロリー差分: {Math.round(calorieDifference() * 10) / 10} kcal</p>
      </div>
      <button className="calorie-save-button" onClick={handleSave}>保存</button>
      {isCalendarOpen && (
        <div className="calorie-calendar-modal-overlay" onClick={closeCalendarModal}>
          <div className="calorie-calendar-modal" onClick={(e) => e.stopPropagation()}>
            <Calendar
              onChange={handleDateChange}
              formatShortWeekday={CalenderFormatShortWeekday}
              tileClassName={CalenderTileClassName}
              tileContent={CalenderTileContent}
              value={selectedDate ? new Date(selectedDate) : new Date()}
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
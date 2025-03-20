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
  BarElement,
  BarController,
} from "chart.js";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './styles/calorie-info.css';
import '../Home/Body/Calender/styles/CalenderWeekdays.css';
import '../Home/Body/Calender/styles/CalenderNavigation.css';
import '../Home/Body/Calender/styles/CalenderDays.css';
import '../Home/Body/Calender/styles/CalenderCommon.css';
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
  Legend,
  BarElement,
  BarController,
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
  const [error, setError] = useState("");
  const [period, setPeriod] = useState('7days');
  const [userId, setUserId] = useState(null);
  const [totalCalorieDifference, setTotalCalorieDifference] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: '合計消費カロリー',
        data: [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        pointBackgroundColor: "rgba(255, 20, 147, 1)",
        fill: false,
        pointStyle: 'circle',
        pointRadius: 3,
        type: 'bar',
      },
      {
        label: '摂取カロリー',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        pointBackgroundColor: "rgba(50, 150, 150, 1)",
        fill: false,
        pointStyle: 'circle',
        pointRadius: 3,
        type: 'bar',
      },
      {
        label: '歩数',
        data: [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        pointBackgroundColor: "rgba(0, 123, 255, 1)",
        fill: false,
        pointStyle: 'circle',
        pointRadius: 3,
        type: 'line',
        hidden: true,
      },
      {
        label: 'カロリー差分',
        data: [],
        type: 'bar',
        backgroundColor: (context) => {
          const value = context.raw;
          return value < 0 ? 'rgba(54, 162, 235, 0.6)' : 'rgba(255, 206, 86, 0.6)';
        },
        fill: false,
        pointStyle: 'circle',
        pointRadius: 3,
      },
    ],
  });

  // ユーザーIDをローカルストレージから取得
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
    } else {
      setError('ユーザーIDが見つかりません。ログインしてください。');
    }
  }, []);

  const fetchData = async () => {
    if (!userId) return;

    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://diet-maker-d07eb3099e56.herokuapp.com';
      
      const stepsResponse = await axios.get(`${apiUrl}/steps`, {
        params: { user_id: userId }
      });
      
      const dailyCaloriesResponse = await axios.get(`${apiUrl}/daily_calories`, {
        params: { user_id: userId }
      });
      
      const intakeCaloriesResponse = await axios.get(`${apiUrl}/intake_calories`, {
        params: { user_id: userId }
      });

      const stepsData = stepsResponse.data.map(item => ({
        date: new Date(item.date).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' }),
        value: item.steps,
      }));

      const dailyCaloriesData = dailyCaloriesResponse.data.map(item => ({
        date: new Date(item.date).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' }),
        value: item.total_calories,
      }));

      const intakeCaloriesData = intakeCaloriesResponse.data.map(item => ({
        date: new Date(item.date).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' }),
        value: item.calories,
      }));

      // カロリー差分データを計算
      // 日付をキーとした辞書を作成して、同じ日付のデータを結合
      const dateMap = new Map();
      
      dailyCaloriesData.forEach(item => {
        dateMap.set(item.date, { ...dateMap.get(item.date) || {}, dailyCalories: item.value });
      });
      
      intakeCaloriesData.forEach(item => {
        dateMap.set(item.date, { ...dateMap.get(item.date) || {}, intakeCalories: item.value });
      });
      
      const calorieDifferenceData = Array.from(dateMap.entries()).map(([date, values]) => ({
        date,
        value: (values.intakeCalories || 0) - (values.dailyCalories || 0),
      }));

      let filteredStepsData = stepsData;
      let filteredDailyCaloriesData = dailyCaloriesData;
      let filteredIntakeCaloriesData = intakeCaloriesData;
      let filteredCalorieDifferenceData = calorieDifferenceData;

      const now = new Date();

      const filterDataByDays = (data, days) => data.slice(-days);
      const filterDataByMonths = (data, months) => data.filter(item => {
        const dateParts = item.date.split('/');
        const itemDate = new Date(now.getFullYear(), parseInt(dateParts[0]) - 1, parseInt(dateParts[1]));
        return (now - itemDate) / (1000 * 60 * 60 * 24) <= months * 30;
      });

      switch (period) {
        case '7days':
          filteredStepsData = filterDataByDays(stepsData, 7);
          filteredDailyCaloriesData = filterDataByDays(dailyCaloriesData, 7);
          filteredIntakeCaloriesData = filterDataByDays(intakeCaloriesData, 7);
          filteredCalorieDifferenceData = filterDataByDays(calorieDifferenceData, 7);
          break;
        case '1month':
          filteredStepsData = filterDataByMonths(stepsData, 1);
          filteredDailyCaloriesData = filterDataByMonths(dailyCaloriesData, 1);
          filteredIntakeCaloriesData = filterDataByMonths(intakeCaloriesData, 1);
          filteredCalorieDifferenceData = filterDataByMonths(calorieDifferenceData, 1);
          break;
        case '2months':
          filteredStepsData = filterDataByMonths(stepsData, 2);
          filteredDailyCaloriesData = filterDataByMonths(dailyCaloriesData, 2);
          filteredIntakeCaloriesData = filterDataByMonths(intakeCaloriesData, 2);
          filteredCalorieDifferenceData = filterDataByMonths(calorieDifferenceData, 2);
          break;
        case '3months':
          filteredStepsData = filterDataByMonths(stepsData, 3);
          filteredDailyCaloriesData = filterDataByMonths(dailyCaloriesData, 3);
          filteredIntakeCaloriesData = filterDataByMonths(intakeCaloriesData, 3);
          filteredCalorieDifferenceData = filterDataByMonths(calorieDifferenceData, 3);
          break;
        case 'all':
          filteredStepsData = stepsData;
          filteredDailyCaloriesData = dailyCaloriesData;
          filteredIntakeCaloriesData = intakeCaloriesData;
          filteredCalorieDifferenceData = calorieDifferenceData;
          break;
        default:
          filteredStepsData = filterDataByDays(stepsData, 7);
          filteredDailyCaloriesData = filterDataByDays(dailyCaloriesData, 7);
          filteredIntakeCaloriesData = filterDataByDays(intakeCaloriesData, 7);
          filteredCalorieDifferenceData = filterDataByDays(calorieDifferenceData, 7);
      }

      // カロリー差分の合計を計算
      const totalDifference = filteredCalorieDifferenceData.reduce((sum, item) => sum + item.value, 0);
      setTotalCalorieDifference(Math.round(totalDifference * 10) / 10);

      // 日付順にソート
      const allDates = [...new Set([
        ...filteredStepsData.map(item => item.date),
        ...filteredDailyCaloriesData.map(item => item.date),
        ...filteredIntakeCaloriesData.map(item => item.date)
      ])].sort((a, b) => {
        const [aMonth, aDay] = a.split('/').map(Number);
        const [bMonth, bDay] = b.split('/').map(Number);
        return aMonth !== bMonth ? aMonth - bMonth : aDay - bDay;
      });

      setChartData({
        labels: allDates,
        datasets: [
          {
            ...chartData.datasets[0],
            data: allDates.map(date => {
              const found = filteredDailyCaloriesData.find(item => item.date === date);
              return found ? found.value : null;
            }),
          },
          {
            ...chartData.datasets[1],
            data: allDates.map(date => {
              const found = filteredIntakeCaloriesData.find(item => item.date === date);
              return found ? found.value : null;
            }),
          },
          {
            ...chartData.datasets[2],
            data: allDates.map(date => {
              const found = filteredStepsData.find(item => item.date === date);
              return found ? found.value : null;
            }),
          },
          {
            ...chartData.datasets[3],
            data: allDates.map(date => {
              const found = filteredCalorieDifferenceData.find(item => item.date === date);
              return found ? found.value : null;
            }),
          },
        ],
      });
    } catch (error) {
      console.error('データの取得に失敗しました:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [period, userId]);

  const handleStepsChange = (value) => setSteps(value);
  const handleTrainingCaloriesChange = (value) => setTrainingCalories(value);
  const handleBasalMetabolismChange = (value) => setBasalMetabolism(value);
  const handleIntakeCaloriesChange = (value) => setIntakeCalories(value);

  const calculateStepCalories = () => steps * 0.04;
  const totalCaloriesBurned = () => calculateStepCalories() + parseFloat(trainingCalories || 0) + parseFloat(basalMetabolism || 0);
  const calorieDifference = () => parseFloat(intakeCalories || 0) - totalCaloriesBurned();

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
    setSelectedDate(offsetDate);
    setIsCalendarOpen(false);
  };

  const handleSave = async () => {
    if (!userId) {
      setError('ユーザーIDが見つかりません。ログインしてください。');
      return;
    }

    if (!selectedDate || !steps || !trainingCalories || !basalMetabolism || !intakeCalories) {
      setError('全ての項目を入力してください');
      return;
    }

    setError('');

    const formattedDate = selectedDate instanceof Date 
      ? selectedDate.toISOString().split('T')[0]
      : selectedDate;
      
    const totalCalories = parseFloat(trainingCalories) + parseFloat(basalMetabolism) + (parseFloat(steps) * 0.04);

    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://diet-maker-d07eb3099e56.herokuapp.com';
      
      const stepsResponse = await axios.post(`${apiUrl}/steps`, {
        step: {
          user_id: userId,
          date: formattedDate,
          steps: steps,
          calories_burned: parseFloat(steps) * 0.04,
        }
      });

      const dailyCaloriesResponse = await axios.post(`${apiUrl}/daily_calories`, {
        daily_calorie: {
          user_id: userId,
          date: formattedDate,
          total_calories: totalCalories,
        }
      });

      const intakeCaloriesResponse = await axios.post(`${apiUrl}/intake_calories`, {
        intake_calorie: {
          user_id: userId,
          date: formattedDate,
          calories: intakeCalories,
        }
      });

      if (stepsResponse.status === 201 && dailyCaloriesResponse.status === 201 && intakeCaloriesResponse.status === 201) {
        console.log("Data saved successfully");
        fetchData();
        setError('');
        alert('データの保存に成功しました');
        
        // 入力フィールドをクリア
        setSteps(0);
        setTrainingCalories(0);
        setBasalMetabolism(0);
        setIntakeCalories(0);
      } else {
        console.error("Error saving data:", stepsResponse.data, dailyCaloriesResponse.data, intakeCaloriesResponse.data);
        setError('データの保存に失敗しました');
      }
    } catch (error) {
      console.error("Error saving data:", error);
      setError(`データの保存に失敗しました: ${error.response?.data?.error || error.message}`);
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
            size: 20,
          },
          className: 'calorie-x-axis-title',
        },
        ticks: {
          font: {
            size: 16,
          },
          className: 'calorie-x-axis-ticks',
        },
      },
      y: {
        title: {
          display: true,
          text: '(kcal)',
          font: {
            size: 16,
          },
          className: 'calorie-y-axis-title',
        },
        ticks: {
          font: {
            size: 16,
          },
          className: 'calorie-y-axis-ticks',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 14,
          },
          usePointStyle: true,
          padding: 20,
        },
        onClick: (e, legendItem, legend) => {
          const index = legendItem.datasetIndex;
          const ci = legend.chart;
          const meta = ci.getDatasetMeta(index);

          meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
          ci.update();
        },
      },
      tooltip: {
        titleFont: {
          size: 16,
        },
        bodyFont: {
          size: 12,
        },
        className: 'calorie-tooltip',
      },
    },
  };

  return (
    <div className="calorie-info-container">
      <div className="calorie-chart-controls">
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
      <div className="calorie-chart">
        <Line data={chartData} options={options} />
      </div>
      <div className="total-calorie-difference">
        <p>表示期間内のカロリー差分合計: <span className={totalCalorieDifference < 0 ? "negative" : "positive"}>{totalCalorieDifference} kcal</span></p>
      </div>
      <p className="legend-instruction">凡例をクリックすると、グラフからデータセットを非表示にできます。</p>
      <div className="calorie-input-group">
        <label className="calorie-label">日付を選択:</label>
        <input
          type="text"
          value={selectedDate ? (selectedDate instanceof Date ? selectedDate.toLocaleDateString() : new Date(selectedDate).toLocaleDateString()) : ''}
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
      {error && <p className="calorie-error-message">{error}</p>}
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
              value={selectedDate ? (selectedDate instanceof Date ? selectedDate : new Date(selectedDate)) : new Date()}
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
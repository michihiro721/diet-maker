import React, { useState, useEffect, useCallback } from "react";
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
import { CalenderFormatShortWeekday, CalenderTileClassName, CalenderTileContent } from "../Home/Body/Calender/Calender";

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
  const [activityLevel, setActivityLevel] = useState(""); // 活動量レベル
  const [basalMetabolism, setBasalMetabolism] = useState(0);
  const [intakeCalories, setIntakeCalories] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false); // 活動量モーダル用
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

  // 活動レベル係数
  const activityLevelFactors = {
    "活動量が低い人": 1.2,
    "活動量がやや低い人": 1.375,
    "活動量が標準の人": 1.55,
    "活動量が高い人": 1.725,
    "活動量がかなり高い人": 1.9
  };

  // 基礎代謝計算
  const calculateBMR = (gender, height, weight, age) => {
    const heightValue = parseFloat(height);
    const weightValue = parseFloat(weight);
    const ageValue = parseFloat(age);

    let bmrValue = 0;
    if (gender === "男性") {
      bmrValue = (10 * weightValue) + (6.25 * heightValue) - (5 * ageValue) + 5;
    } else if (gender === "女性") {
      bmrValue = (10 * weightValue) + (6.25 * heightValue) - (5 * ageValue) - 161;
    }
    return bmrValue;
  };

  const fetchUserData = useCallback(async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://diet-maker-d07eb3099e56.herokuapp.com';
      const token = localStorage.getItem('jwt');

      if (!token) {
        setError("認証情報が見つかりません。再度ログインしてください。");
        return;
      }

      const response = await axios.get(`${apiUrl}/users/show`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const userData = response.data;

      if (userData.gender && userData.height && userData.weight && userData.age) {
        const calculatedBMR = calculateBMR(
          userData.gender,
          userData.height,
          userData.weight,
          userData.age
        );
        setBasalMetabolism(Math.round(calculatedBMR));
      }
      
    } catch (error) {
      setError("ユーザーデータの取得に失敗しました。");
    }
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
      fetchUserData();
    } else {
      setError('この機能を使用するには、ログインが必要です。');
    }
  }, [fetchUserData]);

  const fetchData = useCallback(async () => {
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


      const totalDifference = filteredCalorieDifferenceData.reduce((sum, item) => sum + item.value, 0);
      setTotalCalorieDifference(Math.round(totalDifference * 10) / 10);


      const allDates = [...new Set([
        ...filteredStepsData.map(item => item.date),
        ...filteredDailyCaloriesData.map(item => item.date),
        ...filteredIntakeCaloriesData.map(item => item.date)
      ])].sort((a, b) => {
        const [aMonth, aDay] = a.split('/').map(Number);
        const [bMonth, bDay] = b.split('/').map(Number);
        return aMonth !== bMonth ? aMonth - bMonth : aDay - bDay;
      });

      setChartData(prevChartData => ({
        labels: allDates,
        datasets: [
          {
            ...prevChartData.datasets[0],
            data: allDates.map(date => {
              const found = filteredDailyCaloriesData.find(item => item.date === date);
              return found ? found.value : null;
            }),
          },
          {
            ...prevChartData.datasets[1],
            data: allDates.map(date => {
              const found = filteredIntakeCaloriesData.find(item => item.date === date);
              return found ? found.value : null;
            }),
          },
          {
            ...prevChartData.datasets[2],
            data: allDates.map(date => {
              const found = filteredStepsData.find(item => item.date === date);
              return found ? found.value : null;
            }),
          },
          {
            ...prevChartData.datasets[3],
            data: allDates.map(date => {
              const found = filteredCalorieDifferenceData.find(item => item.date === date);
              return found ? found.value : null;
            }),
          },
        ],
      }));
    } catch (error) {
      console.error('データの取得中にエラーが発生しました:', error);
    }
  }, [period, userId]);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId, fetchData]);

  const handleStepsChange = (value) => setSteps(value);

  const handleActivityLevelChange = (value) => setActivityLevel(value);

  const handleBasalMetabolismChange = (value) => setBasalMetabolism(value);
  const handleIntakeCaloriesChange = (value) => setIntakeCalories(value);

  const calculateTotalCalories = () => {
    const factor = activityLevelFactors[activityLevel] || 1;
    return Math.round(parseFloat(basalMetabolism || 0) * factor);
  };

  const calorieDifference = () => parseFloat(intakeCalories || 0) - calculateTotalCalories();

  const openCalendarModal = () => setIsCalendarOpen(true);
  const closeCalendarModal = () => setIsCalendarOpen(false);

  const openWeightModal = (inputType) => {
    setCurrentInput(inputType);
    setIsWeightModalOpen(true);
  };

  const closeWeightModal = () => setIsWeightModalOpen(false);

  const openActivityModal = () => {
    setIsActivityModalOpen(true);
  };

  const closeActivityModal = () => {
    setIsActivityModalOpen(false);
  };

  const handleWeightModalSave = (value) => {
    switch (currentInput) {
      case "steps":
        handleStepsChange(value);
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

  const selectActivityLevel = (level) => {
    handleActivityLevelChange(level);
    setIsActivityModalOpen(false);
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

    if (!selectedDate || !steps || !activityLevel || !basalMetabolism || !intakeCalories) {
      setError('全ての項目を入力してください');
      return;
    }

    setError('');

    const formattedDate = selectedDate instanceof Date 
      ? selectedDate.toISOString().split('T')[0]
      : selectedDate;
      
    const totalCalories = calculateTotalCalories();

    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://diet-maker-d07eb3099e56.herokuapp.com';
      
      const stepsResponse = await axios.post(`${apiUrl}/steps`, {
        step: {
          user_id: userId,
          date: formattedDate,
          steps: steps,
          calories_burned: 0,
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
        fetchData();
        setError('');
        alert('データの保存に成功しました');

        setSteps(0);
        setIntakeCalories(0);
      } else {
        setError('データの保存に失敗しました');
      }
    } catch (error) {
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

  const ActivityLevelModal = () => (
    <div className="calorie-calendar-modal-overlay" onClick={closeActivityModal}>
      <div className="calorie-activity-modal" onClick={(e) => e.stopPropagation()}>
        <h3>活動レベルを選択</h3>
        <div className="activity-options">
          <div className="activity-option" onClick={() => selectActivityLevel("活動量が低い人")}>
            <input
              type="radio"
              checked={activityLevel === "活動量が低い人"}
              readOnly
            />
            <div className="activity-content">
              <h4>活動量が低い人</h4>
              <p>デスクワーク中心で座っていることが多く、<br/>1日の運動は通勤・通学や近所のお買い物程度</p>
            </div>
          </div>

          <div className="activity-option" onClick={() => selectActivityLevel("活動量がやや低い人")}>
            <input
              type="radio"
              checked={activityLevel === "活動量がやや低い人"}
              readOnly
            />
            <div className="activity-content">
              <h4>活動量がやや低い人</h4>
              <p>上記の活動量が低い人＋1週間に1，2回程度軽い運動や筋トレをする</p>
            </div>
          </div>

          <div className="activity-option" onClick={() => selectActivityLevel("活動量が標準の人")}>
            <input
              type="radio"
              checked={activityLevel === "活動量が標準の人"}
              readOnly
            />
            <div className="activity-content">
              <h4>活動量が標準の人</h4>
              <p>営業の外回りや肉体労働で1日中よく動いている<br/>または1週間に2，3回程度強度の高い運動や筋トレをする</p>
            </div>
          </div>

          <div className="activity-option" onClick={() => selectActivityLevel("活動量が高い人")}>
            <input
              type="radio"
              checked={activityLevel === "活動量が高い人"}
              readOnly
            />
            <div className="activity-content">
              <h4>活動量が高い人</h4>
              <p>上記の標準の人＋1週間に4，5回程度強度の高い運動や筋トレをする</p>
            </div>
          </div>

          <div className="activity-option" onClick={() => selectActivityLevel("活動量がかなり高い人")}>
            <input
              type="radio"
              checked={activityLevel === "活動量がかなり高い人"}
              readOnly
            />
            <div className="activity-content">
              <h4>活動量がかなり高い人</h4>
              <p>スポーツ選手・アスリート</p>
            </div>
          </div>
        </div>
        <button className="calorie-modal-close-button" onClick={closeActivityModal}>閉じる</button>
      </div>
    </div>
  );

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
        <label className="calorie-label">日付を選択</label>
        <input
          type="text"
          value={selectedDate ? (selectedDate instanceof Date ? selectedDate.toLocaleDateString() : new Date(selectedDate).toLocaleDateString()) : ''}
          readOnly
          onClick={openCalendarModal}
          className="calorie-input"
        />
      </div>
      <div className="calorie-input-group">
        <label className="calorie-label">歩数</label>
        <input type="text" value={steps ? `${steps} 歩` : ''} readOnly onClick={() => openWeightModal("steps")} className="calorie-input" />
      </div>
      <div className="calorie-input-group">
        <label className="calorie-label">活動量</label>
        <input
          type="text"
          value={activityLevel || '活動量を選択してください'}
          readOnly
          onClick={openActivityModal}
          className="calorie-input"
        />
      </div>
      <div className="calorie-input-group">
        <label className="calorie-label">基礎代謝</label>
        <input type="text" value={basalMetabolism ? `${basalMetabolism} kcal` : ''} readOnly onClick={() => openWeightModal("basalMetabolism")} className="calorie-input" />
      </div>
      <div className="calorie-input-group">
        <label className="calorie-label">1日の摂取カロリー</label>
        <input type="text" value={intakeCalories ? `${intakeCalories} kcal` : ''} readOnly onClick={() => openWeightModal("intakeCalories")} className="calorie-input" />
      </div>
      {error && <p className="calorie-error-message">{error}</p>}
      <div className="calorie-summary">
        <p>合計消費カロリー: {calculateTotalCalories()} kcal</p>
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
      {isActivityModalOpen && <ActivityLevelModal />}
    </div>
  );
};

export default CalorieInfo;
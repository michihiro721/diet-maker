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
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './styles/Weight.css';
import '../Home/Body/Calender/styles/CalenderWeekdays.css';
import '../Home/Body/Calender/styles/CalenderNavigation.css';
import '../Home/Body/Calender/styles/CalenderDays.css';
import '../Home/Body/Calender/styles/CalenderCommon.css';
import CalenderFormatShortWeekday from "../Home/Body/Calender/CalenderFormatShortWeekday";
import CalenderTileClassName from "../Home/Body/Calender/CalenderTileClassName";
import CalenderTileContent from "../Home/Body/Calender/CalenderTileContent";
import WeightModal from './WeightModal';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Weight = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "体重",
        data: [],
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
  const [period, setPeriod] = useState('7days');
  const [goalWeight, setGoalWeight] = useState(null);
  const [goalDate, setGoalDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userId, setUserId] = useState(null);

  // ユーザーIDをローカルストレージから取得
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
    } else {
      setErrorMessage('ユーザーIDが見つかりません。ログインしてください。');
    }
  }, []);

  const fetchData = async () => {
    if (!userId) return;

    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://diet-maker-d07eb3099e56.herokuapp.com';
      const response = await axios.get(`${apiUrl}/weights`, {
        params: { user_id: userId }
      });
      const weights = response.data;

      console.log("Fetched weights data:", weights);

      if (weights && weights.length > 0) {
        // 日付でソート
        weights.sort((a, b) => new Date(a.date) - new Date(b.date));

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
              borderColor: "rgba(0, 123, 255, 0.8)",
              backgroundColor: "rgba(0, 123, 255, 0.5)",
              pointBackgroundColor: "rgba(0, 123, 255, 1)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgba(0, 123, 255, 1)",
              fill: true,
              type: 'bar',
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

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [period, userId]);

  useEffect(() => {
    const fetchGoalData = async () => {
      if (!userId) return;

      try {
        const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://diet-maker-d07eb3099e56.herokuapp.com';
        const response = await axios.get(`${apiUrl}/goals/latest`, {
          params: { user_id: userId }
        });
        const goal = response.data;

        console.log("Fetched goal data:", goal);

        if (goal && Object.keys(goal).length > 0) {
          setGoalWeight(goal.target_weight);
          setGoalDate(new Date(goal.end_date));
        } else {
          setGoalWeight(null);
          setGoalDate(null);
        }
      } catch (error) {
        console.error("Error fetching goal data:", error);
        setGoalWeight(null);
        setGoalDate(null);
      }
    };

    if (userId) {
      fetchGoalData();
    }
  }, [userId]);

  const handleSave = async () => {
    if (!userId) {
      setErrorMessage('ユーザーIDが見つかりません。ログインしてください。');
      setSuccessMessage('');
      return;
    }

    if (!selectedDate || !weight) {
      setErrorMessage('全ての項目を入力してください');
      setSuccessMessage('');
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://diet-maker-d07eb3099e56.herokuapp.com';
      const response = await axios.post(`${apiUrl}/weights`, {
        weight: {
          user_id: userId, // ローカルストレージから取得したIDを使用
          date: selectedDate,
          weight: weight,
        }
      });

      if (response.status === 201) {
        console.log("Data saved successfully");
        fetchData();
        setErrorMessage('');
        setSuccessMessage('データの保存に成功しました');
        setWeight(''); // 入力フィールドをクリア
      } else {
        console.error("Error saving data:", response.data);
        setErrorMessage('データの保存に失敗しました');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error("Error saving data:", error);
      setErrorMessage(`データの保存に失敗しました: ${error.response?.data?.error || error.message}`);
      setSuccessMessage('');
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
          className: 'weight-x-axis-title',
        },
        ticks: {
          font: {
            size: 16,
          },
          className: 'weight-x-axis-ticks',
        },
      },
      y: {
        title: {
          display: true,
          text: '(kg)',
          font: {
            size: 16,
          },
          className: 'weight-y-axis-title',
        },
        ticks: {
          font: {
            size: 16,
          },
          className: 'weight-y-axis-ticks',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        titleFont: {
          size: 16,
        },
        bodyFont: {
          size: 12,
        },
        className: 'weight-tooltip',
      },
    },
  };

  // 目標達成予定日までの残り日数を計算
  const remainingDays = goalDate ? Math.ceil((goalDate - new Date()) / (1000 * 60 * 60 * 24)) : null;

  const handleDateChange = (date) => {
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    setSelectedDate(offsetDate.toISOString().split('T')[0]);
    setIsCalendarModalOpen(false);
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
        <div className="weight-chart">
          <Line data={chartData} options={options} />
        </div>
      </div>
      
      {/* 目標情報は目標が設定されている場合のみ表示 */}
      {goalWeight && goalDate && (
        <div className="goal-info">
          <p className="goal-info-target-weight">目標体重: {goalWeight} kg</p>
          <p className="goal-info-target">目標達成予定日までの残り日数: {remainingDays} 日</p>
        </div>
      )}
      
      <div className="weight-save-controls">
        <label htmlFor="date-select">日付を選択:</label>
        <input
          type="text"
          id="date-select"
          value={selectedDate}
          onClick={() => setIsCalendarModalOpen(true)}
          readOnly
        />
        <label htmlFor="weight-input">体重を入力:</label>
        <input
          type="text"
          id="weight-input"
          value={weight ? `${weight} kg` : ''}
          onClick={() => setIsWeightModalOpen(true)}
          readOnly
        />
        <button className="weight-save-button" onClick={handleSave}>保存</button>
      </div>
      {errorMessage && <p className="weight-error-message">{errorMessage}</p>}
      {successMessage && <p className="weight-success-message">{successMessage}</p>}
      <WeightModal
        isOpen={isWeightModalOpen}
        onClose={() => setIsWeightModalOpen(false)}
        onSave={(value) => {
          setWeight(value);
          setIsWeightModalOpen(false);
        }}
      />
      {isCalendarModalOpen && (
        <div className="calendar-modal-overlay" onClick={() => setIsCalendarModalOpen(false)}>
          <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
            <Calendar
              onChange={handleDateChange}
              formatShortWeekday={CalenderFormatShortWeekday}
              tileClassName={CalenderTileClassName}
              tileContent={CalenderTileContent}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Weight;
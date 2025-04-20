import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './styles/Weight.css';
import { CalenderFormatShortWeekday, CalenderTileClassName, CalenderTileContent } from "../Home/Body/Calender/Calender";
import WeightModal from './WeightModal';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weight, setWeight] = useState('');
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [displayMode, setDisplayMode] = useState('both');


  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
    } else {
      setErrorMessage('この機能を使用するには、ログインが必要です。');
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!userId) return;

    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://diet-maker-d07eb3099e56.herokuapp.com';
      const response = await axios.get(`${apiUrl}/weights`, {
        params: { user_id: userId }
      });
      const weights = response.data;

      if (weights && weights.length > 0) {
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

        const datasets = [];

        if (displayMode === 'bar' || displayMode === 'both') {
          datasets.push({
            label: "体重(棒グラフ)",
            data: weightValues,
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgba(54, 162, 235, 0.8)",
            borderWidth: 1,
            type: 'bar',
            order: 2,
          });
        }

        if (displayMode === 'line' || displayMode === 'both') {
          datasets.push({
            label: "体重(折れ線)",
            data: weightValues,
            borderColor: "rgba(255, 99, 132, 0.8)",
            backgroundColor: "rgba(255, 99, 132, 0)",
            pointBackgroundColor: "rgba(255, 99, 132, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255, 99, 132, 1)",
            pointRadius: 5,
            pointHoverRadius: 7,
            fill: false,
            type: 'line',
            order: 1,
            tension: 0.1
          });
        }

        setChartData({
          labels: dates,
          datasets: datasets,
        });
      }
    } catch (error) {
      alert(`体重データの取得に失敗しました: ${error.message}`);
    }
  }, [userId, period, displayMode]);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [period, userId, displayMode, fetchData]);

  useEffect(() => {
    const fetchGoalData = async () => {
      if (!userId) return;

      try {
        const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://diet-maker-d07eb3099e56.herokuapp.com';
        const response = await axios.get(`${apiUrl}/goals/latest`, {
          params: { user_id: userId }
        });
        const goal = response.data;

        if (goal && Object.keys(goal).length > 0) {
          setGoalWeight(goal.target_weight);
          setGoalDate(new Date(goal.end_date));
        } else {
          setGoalWeight(null);
          setGoalDate(null);
        }
      } catch (error) {
        setGoalWeight(null);
        setGoalDate(null);
        alert(`目標データの取得に失敗しました: ${error.message}`);
      }
    };

    if (userId) {
      fetchGoalData();
    }
  }, [userId]);

  const handleSave = async () => {
    if (!userId) {
      setErrorMessage('ユーザーIDが見つかりません。ログインしてください。');
      return;
    }

    if (!selectedDate || !weight) {
      setErrorMessage('全ての項目を入力してください');
      return;
    }

    try {
      const formattedDate = selectedDate instanceof Date 
        ? selectedDate.toISOString().split('T')[0]
        : selectedDate;

      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://diet-maker-d07eb3099e56.herokuapp.com';
      const response = await axios.post(`${apiUrl}/weights`, {
        weight: {
          user_id: userId,
          date: formattedDate,
          weight: weight,
        }
      });

      if (response.status === 201) {
        fetchData();
        alert('データの保存に成功しました');
        setErrorMessage('');
        setWeight('');
      } else {
        alert('データの保存に失敗しました');
      }
    } catch (error) {
      alert(`データの保存に失敗しました: ${error.response?.data?.error || error.message}`);
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
        display: displayMode === 'both',
        position: 'top',
        labels: {
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        titleFont: {
          size: 16,
        },
        bodyFont: {
          size: 12,
        },
        className: 'weight-tooltip',
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw} kg`;
          }
        }
      },
    },
  };

  // 目標達成予定日までの残り日数計算
  const remainingDays = goalDate ? Math.ceil((goalDate - new Date()) / (1000 * 60 * 60 * 24)) : null;

  const handleDateChange = (date) => {
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    setSelectedDate(offsetDate);
    setIsCalendarModalOpen(false);
  };

  return (
    <div className="weight-chart-container">
      <div className="weight-chart-controls">
        <div className="period-control">
          <label htmlFor="period-select">表示期間:</label>
          <select
            id="period-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="weight-period-select"
          >
            <option value="7days">直近7日</option>
            <option value="1month">直近1ヶ月</option>
            <option value="2months">直近2ヶ月</option>
            <option value="3months">直近3ヶ月</option>
            <option value="all">すべて</option>
          </select>
        </div>

        <div className="display-mode-control">
          <label htmlFor="display-mode-select">グラフ表示:</label>
          <select
            id="display-mode-select"
            value={displayMode}
            onChange={(e) => setDisplayMode(e.target.value)}
            className="weight-display-mode-select"
          >
            <option value="both">棒グラフ＋折れ線</option>
            <option value="bar">棒グラフのみ</option>
            <option value="line">折れ線グラフのみ</option>
          </select>
        </div>
      </div>

      <div className="weight-chart-wrapper">
        <div className="weight-chart">
          <Line data={chartData} options={options} />
        </div>
      </div>

      {goalWeight && goalDate && (
        <div className="goal-info">
          <p className="goal-info-target-weight">目標体重: {goalWeight} kg</p>
          <p className="goal-info-target">目標達成予定日までの残り日数: {remainingDays} 日</p>
        </div>
      )}

      <div className="weight-save-controls">
        <label htmlFor="date-select">日付を選択</label>
        <input
          type="text"
          id="date-select"
          value={selectedDate ? (selectedDate instanceof Date ? selectedDate.toLocaleDateString() : new Date(selectedDate).toLocaleDateString()) : ''}
          onClick={() => setIsCalendarModalOpen(true)}
          readOnly
          className="weight-date-input"
        />
        <label htmlFor="weight-input">体重を入力</label>
        <input
          type="text"
          id="weight-input"
          value={weight ? `${weight} kg` : ''}
          onClick={() => setIsWeightModalOpen(true)}
          readOnly
          className="weight-input"
        />
        <button className="weight-save-button" onClick={handleSave}>保存</button>
      </div>

      {errorMessage && <p className="weight-error-message">{errorMessage}</p>}

      <WeightModal
        isOpen={isWeightModalOpen}
        onClose={() => setIsWeightModalOpen(false)}
        onSave={(value) => {
          setWeight(value);
          setIsWeightModalOpen(false);
        }}
      />

      {isCalendarModalOpen && (
        <div className="weight-calendar-modal-overlay" onClick={() => setIsCalendarModalOpen(false)}>
          <div className="weight-calendar-modal" onClick={(e) => e.stopPropagation()}>
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
    </div>
  );
};

export default Weight;
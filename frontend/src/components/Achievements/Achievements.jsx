import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../Home/Body/Calender/styles/CalenderWeekdays.css';
import '../Home/Body/Calender/styles/CalenderNavigation.css';
import '../Home/Body/Calender/styles/CalenderDays.css';
import '../Home/Body/Calender/styles/CalenderCommon.css';
import CalenderFormatShortWeekday from "../Home/Body/Calender/CalenderFormatShortWeekday";
import CalenderTileContent from "../Home/Body/Calender/CalenderTileContent";
import './styles/Achievements.css';

const Achievements = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [trainingData, setTrainingData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [trainingDates, setTrainingDates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ユーザーIDをローカルストレージから取得
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
    } else {
      setErrorMessage('ユーザーIDが見つかりません。ログインしてください。');
    }
  }, []);

  // 種目データを取得
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setIsLoading(true);
        const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://diet-maker-d07eb3099e56.herokuapp.com';
        const response = await axios.get(`${apiUrl}/workouts`);
        setWorkouts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching workouts:", error);
        setErrorMessage('種目データの取得に失敗しました');
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  // 月間トレーニングデータを取得（カレンダーのマーキング用）
  // TrainingRecord.jsxと同じ方法を使用
  useEffect(() => {
    const fetchMonthlyTrainings = async () => {
      try {
        const userId = localStorage.getItem('userId'); // ユーザーIDを取得
        if (!userId) return;

        // 現在表示されている月の最初と最後の日を計算
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        const firstDayStr = firstDay.toLocaleDateString('en-CA');
        const lastDayStr = lastDay.toLocaleDateString('en-CA');
        
        console.log(`Fetching training data from ${firstDayStr} to ${lastDayStr}`);
        
        // 月のトレーニングデータを取得するAPI
        const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://diet-maker-d07eb3099e56.herokuapp.com';
        const response = await axios.get(`${apiUrl}/trainings/monthly?start_date=${firstDayStr}&end_date=${lastDayStr}&user_id=${userId}`);
        
        console.log("Monthly trainings response:", response.data);
        
        if (response.data && Array.isArray(response.data)) {
          // トレーニングがある日付の配列を作成
          const dates = response.data.map(training => training.date);
          // 重複を削除
          const uniqueDates = [...new Set(dates)];
          console.log("Unique training dates:", uniqueDates);
          setTrainingDates(uniqueDates);
        }
      } catch (error) {
        console.error('Error fetching monthly trainings:', error);
      }
    };

    fetchMonthlyTrainings();
  }, []);

  // 選択した日付のトレーニングデータを取得
  useEffect(() => {
    const fetchTrainingData = async () => {
      if (!userId || !selectedDate) return;

      try {
        setIsLoading(true);
        const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://diet-maker-d07eb3099e56.herokuapp.com';
        const response = await axios.get(`${apiUrl}/trainings`, {
          params: { 
            user_id: userId,
            date: selectedDate
          }
        });
        
        setTrainingData(response.data);
        setErrorMessage('');
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching training data:", error);
        setErrorMessage('トレーニングデータの取得に失敗しました');
        setTrainingData([]);
        setIsLoading(false);
      }
    };

    if (userId && selectedDate) {
      fetchTrainingData();
    }
  }, [userId, selectedDate]);

  // 日付選択の処理
  const handleDateChange = (date) => {
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    setSelectedDate(offsetDate.toISOString().split('T')[0]);
    setIsCalendarModalOpen(false);
  };

  // 種目名を取得する関数
  const getWorkoutName = (workoutId) => {
    const workout = workouts.find(w => w.id === workoutId);
    return workout ? workout.name : `種目ID: ${workoutId}`;
  };

  // 種目のカテゴリーを取得する関数
  const getWorkoutCategory = (workoutId) => {
    const workout = workouts.find(w => w.id === workoutId);
    return workout ? workout.category : '';
  };

  // トレーニングデータをカテゴリーごとにグループ化
  const groupedTrainingData = trainingData.reduce((groups, training) => {
    const category = getWorkoutCategory(training.workout_id);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(training);
    return groups;
  }, {});

  // トレーニングデータがある日付かどうかをチェックする関数（TrainingRecord.jsxと同じ）
  const hasTrainingData = (date) => {
    const dateStr = date.toLocaleDateString('en-CA');
    return trainingDates.includes(dateStr);
  };

  // カレンダータイルのクラス名を決定する関数（TrainingRecord.jsxと同じ）
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const day = date.getDay();
      let classNames = [];
      
      // 土日の色
      if (day === 0) {
        classNames.push('react-calendar__tile--sunday');
      } else if (day === 6) {
        classNames.push('react-calendar__tile--saturday');
      }
      
      // トレーニングデータがある日付の色
      if (hasTrainingData(date)) {
        classNames.push('react-calendar__tile--has-training');
      }
      
      return classNames.join(' ');
    }
    return null;
  };

  return (
    <div className="ach-container">

      <div className="ach-date-selection-container">
        <label htmlFor="ach-date-select">日付を選択</label>
        <input
          type="text"
          id="ach-date-select"
          value={selectedDate}
          onClick={() => setIsCalendarModalOpen(true)}
          readOnly
          className="ach-date-input"
        />
      </div>

      {errorMessage && <p className="ach-error-message">{errorMessage}</p>}
      {successMessage && <p className="ach-success-message">{successMessage}</p>}

      {isLoading ? (
        <div className="ach-loading-spinner">データを読み込み中...</div>
      ) : (
        <div className="ach-training-records-container">
          <h2 className="ach-training-records-title">トレーニング記録</h2>
          
          {trainingData.length > 0 ? (
            <div className="ach-training-records-by-category">
              {Object.keys(groupedTrainingData).map(category => (
                <div key={category} className="ach-category-section">
                  <h3 className="ach-category-title">{category}</h3>
                  <table className="ach-training-records-table">
                    <thead>
                      <tr>
                        <th>種目</th>
                        <th>重量 (kg)</th>
                        <th>セット</th>
                        <th>回数</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedTrainingData[category].map((training) => (
                        <tr key={training.id}>
                          <td>{getWorkoutName(training.workout_id)}</td>
                          <td>{training.weight}</td>
                          <td>{training.sets}</td>
                          <td>{training.reps}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ) : (
            <p className="ach-no-data-message">選択した日付のトレーニング記録はありません</p>
          )}
        </div>
      )}

      {isCalendarModalOpen && (
        <div className="ach-calendar-modal-overlay" onClick={() => setIsCalendarModalOpen(false)}>
          <div className="ach-calendar-modal" onClick={(e) => e.stopPropagation()}>
            <Calendar
              onChange={handleDateChange}
              formatShortWeekday={CalenderFormatShortWeekday}
              tileClassName={tileClassName}
              tileContent={CalenderTileContent}
              value={new Date(selectedDate)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;
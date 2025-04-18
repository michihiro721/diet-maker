import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CalenderFormatShortWeekday, CalenderTileContent } from "../Home/Body/Calender/Calender";
import './styles/Achievements.css';
import DailyStats from './DailyStats';

const Achievements = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [trainingData, setTrainingData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [trainingDates, setTrainingDates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const aerobicExercises = [
    "トレッドミル", "ランニング", "ウォーキング", "エアロバイク", 
    "ストレッチ", "水中ウォーキング", "縄跳び", "階段", "バーピージャンプ"
  ];

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
    } else {
      setErrorMessage('ユーザーIDが見つかりません。ログインしてください。');
    }
  }, []);


  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setIsLoading(true);
        const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://diet-maker-d07eb3099e56.herokuapp.com';
        const response = await axios.get(`${apiUrl}/workouts`);
        setWorkouts(response.data);
        setIsLoading(false);
      } catch (error) {
        setErrorMessage('種目データの取得に失敗しました');
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  // 月間トレーニングデータを取得（カレンダーのマーキング用）
  useEffect(() => {
    const fetchMonthlyTrainings = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const firstDayStr = firstDay.toLocaleDateString('en-CA');
        const lastDayStr = lastDay.toLocaleDateString('en-CA');

        const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://diet-maker-d07eb3099e56.herokuapp.com';
        const response = await axios.get(`${apiUrl}/trainings/monthly?start_date=${firstDayStr}&end_date=${lastDayStr}&user_id=${userId}`);

        if (response.data && Array.isArray(response.data)) {
          const dates = response.data.map(training => training.date);
          const uniqueDates = [...new Set(dates)];
          setTrainingDates(uniqueDates);
        }
      } catch (error) {
      }
    };

    fetchMonthlyTrainings();
  }, []);

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
        setErrorMessage('トレーニングデータの取得に失敗しました');
        setTrainingData([]);
        setIsLoading(false);
      }
    };

    if (userId && selectedDate) {
      fetchTrainingData();
    }
  }, [userId, selectedDate]);

  const handleDateChange = (date) => {
    const formattedDate = date.toLocaleDateString('en-CA');
    setSelectedDate(formattedDate);
    setIsCalendarModalOpen(false);
  };

  const getWorkoutName = (workoutId) => {
    const workout = workouts.find(w => w.id === workoutId);
    return workout ? workout.name : `種目ID: ${workoutId}`;
  };

  const getWorkoutCategory = (workoutId) => {
    const workout = workouts.find(w => w.id === workoutId);
    return workout ? workout.category : '';
  };

  const isAerobicExercise = (workoutId) => {
    const workoutName = getWorkoutName(workoutId);
    const category = getWorkoutCategory(workoutId);

    return aerobicExercises.includes(workoutName) || category === "有酸素";
  };

  const groupedTrainingData = trainingData.reduce((groups, training) => {
    const category = getWorkoutCategory(training.workout_id);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(training);
    return groups;
  }, {});

  const getGroupedExerciseData = (trainings) => {
    const exerciseGroups = {};
    
    trainings.forEach(training => {
      const exerciseName = getWorkoutName(training.workout_id);
      if (!exerciseGroups[exerciseName]) {
        exerciseGroups[exerciseName] = {
          workoutId: training.workout_id,
          sets: []
        };
      }
      
      exerciseGroups[exerciseName].sets.push({
        id: training.id,
        setNumber: training.sets,
        weight: training.weight,
        reps: training.reps
      });
    });

    Object.values(exerciseGroups).forEach(group => {
      group.sets.sort((a, b) => a.setNumber - b.setNumber);
    });
    
    return exerciseGroups;
  };

  const hasTrainingData = (date) => {
    const dateStr = date.toLocaleDateString('en-CA');
    return trainingDates.includes(dateStr);
  };

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

      {isLoading ? (
        <div className="ach-loading-spinner">データを読み込み中...</div>
      ) : (
        <>
          <div className="ach-training-records-container">
            <h2 className="ach-training-records-title">トレーニング記録</h2>
            
            {trainingData.length > 0 ? (
              <div className="ach-training-records-by-category">

                <div className="ach-category-section">

                  <div className="ach-category-list">
                    {Object.keys(groupedTrainingData).map(category => (
                      <span 
                        key={category} 
                        className={`ach-category-badge ${category === "有酸素" ? 'aerobic' : ''}`}
                      >
                        {category}
                      </span>
                    ))}
                  </div>


                  <table className="ach-training-records-table">
                    <thead>
                      <tr>
                        <th>対象部位</th>
                        <th>種目</th>
                        <th>セット</th>
                        <th>重量or時間</th>
                        <th>回数</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(groupedTrainingData).map(([category, trainings]) => {
                        const exerciseGroups = getGroupedExerciseData(trainings);
                        
                        return Object.entries(exerciseGroups).map(([exerciseName, exerciseData], exerciseIndex) => {
                          const isAerobic = isAerobicExercise(exerciseData.workoutId);
                          const setsCount = exerciseData.sets.length;
                          const categoryName = isAerobic ? "有酸素" : category;
                          
                          return (
                            <React.Fragment key={`exercise-${exerciseIndex}`}>
                              {exerciseData.sets.map((set, setIndex) => (
                                <tr key={`set-${set.id}`} className={setIndex === 0 ? 'ach-exercise-first-row' : ''}>
                                  {setIndex === 0 ? (
                                    <>
                                      <td
                                        rowSpan={setsCount}
                                        className={`ach-category-name ${isAerobic ? 'aerobic' : ''}`}
                                      >
                                        {categoryName}
                                      </td>
                                      <td
                                        rowSpan={setsCount}
                                        className={`ach-exercise-name ${isAerobic ? 'aerobic' : ''}`}
                                      >
                                        {exerciseName}
                                      </td>
                                    </>
                                  ) : null}
                                  <td>{set.setNumber}</td>
                                  <td>{set.weight}{isAerobic ? '分' : 'kg'}</td>
                                  <td>{isAerobic ? '-' : set.reps}</td>
                                </tr>
                              ))}
                            </React.Fragment>
                          );
                        });
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="ach-no-data-message">トレーニング記録がありません</p>
            )}
          </div>

          <DailyStats userId={userId} selectedDate={selectedDate} />
        </>
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
              className="ach-calendar"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;
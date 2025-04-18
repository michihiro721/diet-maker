import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './styles/training-record-container.css';
import TrainingInfo from '../TrainingInfo/TrainingInfo';
import TrainingTable from './TrainingTable';
import Modal from '../Modal/Modal';
import TrainingAdder from './TrainingAdder';
import TrainingCopyButton from './TrainingCopyButton';
import { CalenderFormatShortWeekday, CalenderTileContent } from '../../Calender/Calender';
import { aerobicExercises, calculateTotalSessionCalories } from '../TrainingInfo/CaloriesUtils';

const TrainingRecord = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [trainings, setTrainings] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [confirmEndModalVisible, setConfirmEndModalVisible] = useState(false);
  const [currentSet, setCurrentSet] = useState(null);
  const [currentField, setCurrentField] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [trainingToDelete, setTrainingToDelete] = useState(null);
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [trainingDates, setTrainingDates] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginErrorModalVisible, setLoginErrorModalVisible] = useState(false);
  const [deleteRecordModalVisible, setDeleteRecordModalVisible] = useState(false);
  const [maxWeights, setMaxWeights] = useState({});
  const [userWeight, setUserWeight] = useState(70);
  const [totalSessionCalories, setTotalSessionCalories] = useState(0);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(!!userId);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem('userId');

        const token = localStorage.getItem('jwt');

        if (!userId) return;

        if (!token) {
          return;
        }

        try {
          const response = await axios.get(
            `https://diet-maker-d07eb3099e56.herokuapp.com/users/${userId}`,
            {
              headers: { 'Authorization': `Bearer ${token}` }
            }
          );

          if (response.status === 200 && response.data && response.data.weight) {
            setUserWeight(response.data.weight);
          }
        } catch (profileError) {
        }
      } catch (error) {
      }
    };
  
    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    // ワークアウトデータを取得
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get('https://diet-maker-d07eb3099e56.herokuapp.com/workouts');
        setWorkouts(response.data);
      } catch (error) {
      }
    };

    fetchWorkouts();
  }, []);

  // ユーザーの最大重量データを取得
  useEffect(() => {
    const fetchMaxWeights = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const response = await axios.get(`https://diet-maker-d07eb3099e56.herokuapp.com/trainings/max_weights?user_id=${userId}`);
        if (response.status === 200) {
          setMaxWeights(response.data);
        }
      } catch (error) {
      }
    };

    if (isLoggedIn) {
      fetchMaxWeights();
    }
  }, [isLoggedIn]);

  const fetchMonthlyTrainings = useCallback(async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      const firstDayStr = firstDay.toLocaleDateString('en-CA');
      const lastDayStr = lastDay.toLocaleDateString('en-CA');

      const response = await axios.get(`https://diet-maker-d07eb3099e56.herokuapp.com/trainings/monthly?start_date=${firstDayStr}&end_date=${lastDayStr}&user_id=${userId}`);

      if (response.data && Array.isArray(response.data)) {
        const dates = response.data.map(training => training.date);
        const uniqueDates = [...new Set(dates)];
        setTrainingDates(uniqueDates);
      }
    } catch (error) {
    }
  }, [selectedDate]);


  useEffect(() => {
    fetchMonthlyTrainings();
  }, [fetchMonthlyTrainings]);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const formattedDate = selectedDate.toLocaleDateString('en-CA');
        const userId = localStorage.getItem('userId');

        if (!userId) {
          setTrainings([]);
          return;
        }

        const response = await axios.get(`https://diet-maker-d07eb3099e56.herokuapp.com/trainings?date=${formattedDate}&user_id=${userId}`);
        const data = Array.isArray(response.data) ? response.data : [];


        const trainingMap = new Map();
        data.forEach(training => {
          const workout = workouts.find(w => w.id === training.workout_id);
          const exercise = workout ? workout.name : "不明な種目";
          const targetArea = workout ? workout.category : "不明な部位";

          // 有酸素運動かどうか判定
          const isAerobic = aerobicExercises.includes(exercise);

          const set = isAerobic ? {
            minutes: training.weight || 30,
            timer: "02:00"
          } : {
            weight: training.weight,
            reps: training.reps,
            timer: "02:00"
          };

          if (trainingMap.has(exercise)) {
            trainingMap.get(exercise).sets.push(set);
          } else {
            trainingMap.set(exercise, {
              exercise,
              targetArea,
              sets: [set]
            });
          }
        });

        const formattedTrainings = Array.from(trainingMap.values());
        setTrainings(formattedTrainings);
      } catch (error) {
        setTrainings([]);
      }
    };

    fetchTrainings();
  }, [selectedDate, workouts]);


  useEffect(() => {
    const totalCalories = calculateTotalSessionCalories(trainings, userWeight);
    setTotalSessionCalories(totalCalories);
  }, [trainings, userWeight]);

  const handleTrainingCopied = () => {
    fetchMonthlyTrainings();
  };

  const getMaxWeightForExercise = (exerciseName) => {
    if (aerobicExercises.includes(exerciseName)) {
      return null;
    }

    const workout = workouts.find(w => w.name === exerciseName);
    if (!workout) return null;

    const maxWeight = maxWeights[workout.id];
    return maxWeight ? `${maxWeight}kg` : null;
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

  const formatTotalCalories = (value) => {
    if (value <= 0) return 'データなし';
    return `${value} kcal`;
  };

  const handleAddSet = (trainingIndex) => {
    const training = trainings[trainingIndex];
    const isAerobic = aerobicExercises.includes(training.exercise);
    const lastSet = training.sets && training.sets.length > 0 ? training.sets[training.sets.length - 1] : null;

    const newSet = isAerobic 
      ? {
          minutes: lastSet ? lastSet.minutes : 30,
          timer: lastSet ? lastSet.timer : "02:00",
          complete: false
        }
      : {
          weight: lastSet ? lastSet.weight : 0,
          reps: lastSet ? lastSet.reps : 0,
          timer: lastSet ? lastSet.timer : "02:00",
          complete: false
        };

    const updatedTrainings = trainings.map((training, index) =>
      index === trainingIndex
        ? { ...training, sets: [...(training.sets || []), newSet] }
        : training
    );
    setTrainings(updatedTrainings);
  };

  const handleRemoveSet = (trainingIndex, setIndex) => {
    const updatedSets = trainings[trainingIndex].sets.filter((_, i) => i !== setIndex);
    const updatedTrainings = trainings.map((training, index) =>
      index === trainingIndex
        ? { ...training, sets: updatedSets }
        : training
    );
    setTrainings(updatedTrainings);
  };

  const handleUpdateSet = (trainingIndex, setIndex, field, value) => {
    const updatedSets = trainings[trainingIndex].sets.map((set, i) =>
      i === setIndex ? { ...set, [field]: value } : set
    );
    const updatedTrainings = trainings.map((training, index) =>
      index === trainingIndex
        ? { ...training, sets: updatedSets }
        : training
    );
    setTrainings(updatedTrainings);
  };

  const openModal = (trainingIndex, setIndex, field, value) => {
    setCurrentSet({ trainingIndex, setIndex });
    setCurrentField(field);
    setCurrentValue(value === 0 ? "" : value);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleModalSave = () => {
    handleUpdateSet(currentSet.trainingIndex, currentSet.setIndex, currentField, currentValue);
    closeModal();
  };

  const handleClickOutside = (event) => {
    if (event.target.className === "modal") {
      closeModal();
    }
  };

  const addTraining = (newTraining) => {
    const isAerobic = aerobicExercises.includes(newTraining.exercise);

    const initialSet = isAerobic 
      ? { minutes: 30, timer: "02:00", complete: false }
      : { weight: 0, reps: 0, timer: "02:00", complete: false };

    const trainingWithSet = {
      ...newTraining,
      sets: [initialSet]
    };

    setTrainings([...trainings, trainingWithSet]);
  };

  const confirmDeleteTraining = (trainingIndex) => {
    setTrainingToDelete(trainingIndex);
    setDeleteModalVisible(true);
  };

  const deleteTraining = () => {
    const updatedTrainings = trainings.filter((_, index) => index !== trainingToDelete);
    setTrainings(updatedTrainings);
    setDeleteModalVisible(false);
  };

  const handleExerciseChange = (trainingIndex, exercise, part) => {
    const currentExercise = trainings[trainingIndex].exercise;
    const wasAerobic = aerobicExercises.includes(currentExercise);
    const isAerobic = aerobicExercises.includes(exercise);

    if (wasAerobic !== isAerobic) {
      const convertedSets = trainings[trainingIndex].sets.map(set => {
        if (isAerobic) {
          return {
            minutes: set.weight || 30,
            timer: set.timer || "02:00",
            complete: set.complete || false
          };
        } else {
          return {
            weight: set.minutes || 20,
            reps: 5,
            timer: set.timer || "02:00",
            complete: set.complete || false
          };
        }
      });
      
      const updatedTrainings = trainings.map((training, index) =>
        index === trainingIndex
          ? { ...training, exercise, targetArea: part, sets: convertedSets }
          : training
      );
      setTrainings(updatedTrainings);
    } else {
      const updatedTrainings = trainings.map((training, index) =>
        index === trainingIndex
          ? { ...training, exercise, targetArea: part }
          : training
      );
      setTrainings(updatedTrainings);
    }
  };

  const confirmEndTraining = () => {
    if (!isLoggedIn) {
      setLoginErrorModalVisible(true);
      return;
    }
    
    setConfirmEndModalVisible(true);
  };

  const endTraining = () => {
    setConfirmEndModalVisible(false);
    saveTrainingRecord();
  };

  const confirmDeleteRecord = () => {
    if (!isLoggedIn) {
      setLoginErrorModalVisible(true);
      return;
    }

    if (!hasTrainingData(selectedDate)) {
      alert('この日付のトレーニング記録は存在しません');
      return;
    }

    setDeleteRecordModalVisible(true);
  };

  const deleteTrainingRecord = async () => {
    setDeleteRecordModalVisible(false);

    try {
      const userId = localStorage.getItem('userId');
      const formattedDate = selectedDate.toLocaleDateString('en-CA');

      const response = await axios.delete(`https://diet-maker-d07eb3099e56.herokuapp.com/trainings/destroy_by_date`, {
        params: {
          date: formattedDate,
          user_id: userId
        }
      });

      if (response.status === 200) {
        setTrainings([]);
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const firstDayStr = firstDay.toLocaleDateString('en-CA');
        const lastDayStr = lastDay.toLocaleDateString('en-CA');

        const monthlyResponse = await axios.get(`https://diet-maker-d07eb3099e56.herokuapp.com/trainings/monthly?start_date=${firstDayStr}&end_date=${lastDayStr}&user_id=${userId}`);

        if (monthlyResponse.data && Array.isArray(monthlyResponse.data)) {
          const dates = monthlyResponse.data
            .filter(training => training.date !== formattedDate)
            .map(training => training.date);
          const uniqueDates = [...new Set(dates)];
          setTrainingDates(uniqueDates);
        }

        alert('トレーニング記録の削除に成功しました');
      } else {
        throw new Error('Training data could not be deleted');
      }
    } catch (error) {
      alert('トレーニング記録の削除に失敗しました');
    }
  };

  const saveTrainingRecord = async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      setMessage('ログインしていないため、トレーニングデータを保存できません');
      setMessageClass('save-error-message');
      return;
    }

    const formattedDate = selectedDate.toLocaleDateString('en-CA');

    const trainingData = trainings.map(training => {
      const workout = Array.isArray(workouts) ? workouts.find(w => w.name === training.exercise) : null;
      const isAerobic = aerobicExercises.includes(training.exercise);


      return training.sets.map((set, setIndex) => ({
        date: formattedDate,
        user_id: userId,
        goal_id: null,
        workout_id: workout ? workout.id : null,
        sets: setIndex + 1,
        weight: isAerobic ? (set.minutes || 30) : (set.weight || 0),
        reps: isAerobic ? 0 : (set.reps || 0)
      }));
    }).flat();

    try {
      const response = await axios.post('https://diet-maker-d07eb3099e56.herokuapp.com/trainings', { training: trainingData });

      if (response.status !== 201) {
        throw new Error('Training data could not be saved');
      }
      setMessageClass('save-success-message');
      alert('トレーニングデータの保存に成功しました');

      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const firstDayStr = firstDay.toLocaleDateString('en-CA');
      const lastDayStr = lastDay.toLocaleDateString('en-CA');
      const monthlyResponse = await axios.get(`https://diet-maker-d07eb3099e56.herokuapp.com/trainings/monthly?start_date=${firstDayStr}&end_date=${lastDayStr}&user_id=${userId}`);

      if (monthlyResponse.data && Array.isArray(monthlyResponse.data)) {
        const dates = monthlyResponse.data.map(training => training.date);
        const uniqueDates = [...new Set(dates)];
        setTrainingDates(uniqueDates);
      }

      const maxWeightsResponse = await axios.get(`https://diet-maker-d07eb3099e56.herokuapp.com/trainings/max_weights?user_id=${userId}`);
      if (maxWeightsResponse.status === 200) {
        setMaxWeights(maxWeightsResponse.data);
      }
    } catch (error) {
      setMessageClass('save-error-message');
      alert('トレーニングデータの保存に失敗しました');
    }
  };

  const formattedDateDisplay = selectedDate ? selectedDate.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short'
  }) : '日付が選択されていません';

  const currentDateHasTrainingData = hasTrainingData(selectedDate);

  const hasAnyTrainingData = Array.isArray(trainings) && trainings.length > 0;

  return (
    <div className="training-record-container">
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileClassName={tileClassName}
        formatShortWeekday={CalenderFormatShortWeekday}
        tileContent={CalenderTileContent}
      />
      <h2 className="training-record-titles">トレーニング記録 : {formattedDateDisplay}</h2>

      {/* メニューをコピーボタンと記録削除ボタン */}
      <div className="training-buttons-container">
        <TrainingCopyButton
          trainings={trainings}
          workouts={workouts}
          onTrainingCopied={handleTrainingCopied}
        />

        {currentDateHasTrainingData && (
          <div className="delete-record-button-container">
            <button
              className={`delete-record-button ${!isLoggedIn ? 'delete-record-button-disabled' : ''}`}
              onClick={confirmDeleteRecord}
            >
              トレーニング記録削除
            </button>
          </div>
        )}
      </div>

      {!isLoggedIn && (
        <div className="login-warning-message">
          ログインしないとトレーニングデータを保存できません。<br />
          <a href="/login" className="login-link">ログインする</a>
        </div>
      )}

      {hasAnyTrainingData ? (
        trainings.map((training, trainingIndex) => (
          <div key={trainingIndex} className="training-section">
            <TrainingInfo
              currentExercise={training.exercise}
              currentPart={training.targetArea}
              onExerciseChange={(exercise, part) => handleExerciseChange(trainingIndex, exercise, part)}
              maxWeight={getMaxWeightForExercise(training.exercise)}
              sets={training.sets}
              userWeight={userWeight}
            />
            <TrainingTable
              sets={Array.isArray(training.sets) ? training.sets : []}
              openModal={(setIndex, field, value) => openModal(trainingIndex, setIndex, field, value)}
              handleUpdateSet={(setIndex, field, value) => handleUpdateSet(trainingIndex, setIndex, field, value)}
              handleRemoveSet={(setIndex) => handleRemoveSet(trainingIndex, setIndex)}
              handleAddSet={() => handleAddSet(trainingIndex)}
              currentExercise={training.exercise}
              isAerobic={aerobicExercises.includes(training.exercise)}
            />
            <button className="delete-training-button" onClick={() => confirmDeleteTraining(trainingIndex)}>トレーニング削除</button>
          </div>
        ))
      ) : (
        <p className="no-training-data">トレーニングデータがありません。</p>
      )}
      <TrainingAdder addTraining={addTraining} />
      {message && <p className={messageClass}>{message}</p>}


      {hasAnyTrainingData && totalSessionCalories > 0 && (
        <div className="total-calories-container">
          <p className="total-calories-info">
            合計消費カロリー<br />
            <span className="total-calories-value">
              {formatTotalCalories(totalSessionCalories)}
            </span>
            <span className="calories-tooltip">※表示されるカロリーは推定値です</span>
          </p>
        </div>
      )}

      <div className="training-end-button-container">
        <button
          className={`save-training-button ${!isLoggedIn ? 'save-training-button-disabled' : ''}`}
          onClick={confirmEndTraining}
        >
          トレーニング終了
        </button>
      </div>

      {modalVisible && (
        <Modal
          currentField={currentField}
          currentValue={currentValue}
          setCurrentValue={setCurrentValue}
          handleModalSave={handleModalSave}
          handleClickOutside={handleClickOutside}
        />
      )}
      {deleteModalVisible && (
        <div className="delete-modal">
          <div className="delete-modal-content">
            <p>本当に削除してもよろしいですか？</p>
            <button className="confirm-button" onClick={deleteTraining}>はい</button>
            <button className="cancel-button" onClick={() => setDeleteModalVisible(false)}>いいえ</button>
          </div>
        </div>
      )}
      {confirmEndModalVisible && (
        <div className="delete-modal">
          <div className="delete-modal-content">
              <p>トレーニングデータが保存されます<br />本当にトレーニングを終了してもよろしいですか？</p>
            <button className="confirm-button" onClick={endTraining}>はい</button>
            <button className="cancel-button" onClick={() => setConfirmEndModalVisible(false)}>いいえ</button>
          </div>
        </div>
      )}
      {loginErrorModalVisible && (
        <div className="delete-modal">
          <div className="delete-modal-content">
            <p>トレーニングを保存するには<br />ログインが必要です</p>
            <a href="/login" className="login-button">ログイン画面へ</a>
            <button className="cancel-button" onClick={() => setLoginErrorModalVisible(false)}>閉じる</button>
          </div>
        </div>
      )}

      {deleteRecordModalVisible && (
        <div className="delete-modal">
          <div className="delete-modal-content">
            <p>{formattedDateDisplay}のトレーニング記録を削除します<br />本当に削除してもよろしいですか？</p>
            <button className="confirm-button" onClick={deleteTrainingRecord}>はい</button>
            <button className="cancel-button" onClick={() => setDeleteRecordModalVisible(false)}>いいえ</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingRecord;
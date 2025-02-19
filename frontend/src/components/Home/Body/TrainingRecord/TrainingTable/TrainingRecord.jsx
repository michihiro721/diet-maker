// このコードは、トレーニング記録全体を管理および表示するためのコンポーネントです。
// トレーニングの基本情報、セットの詳細、モーダルを使用した入力補助機能を提供します。

import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from 'react-calendar'; // カレンダーコンポーネントを直接インポート
import 'react-calendar/dist/Calendar.css'; // カレンダーのスタイルをインポート
import './styles/training-record-container.css';
import TrainingInfo from '../TrainingInfo/TrainingInfo';
import TrainingTable from './TrainingTable';
import Modal from '../Modal/Modal';
import TrainingAdder from './TrainingAdder';
import CalenderTileClassName from '../../Calender/CalenderTileClassName'; // CalenderTileClassNameをインポート
import CalenderFormatShortWeekday from '../../Calender/CalenderFormatShortWeekday'; // CalenderFormatShortWeekdayをインポート
import CalenderTileContent from '../../Calender/CalenderTileContent'; // CalenderTileContentをインポート

const TrainingRecord = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [trainings, setTrainings] = useState([]); // 初期値を空の配列に設定
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

  useEffect(() => {
    // ワークアウトデータを取得
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get('https://diet-maker-d07eb3099e56.herokuapp.com/workouts');
        console.log('Fetched workouts:', response.data);
        setWorkouts(response.data);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchWorkouts();
  }, []);

  useEffect(() => {
    // 選択された日付に基づいてトレーニングデータを取得
    const fetchTrainings = async () => {
      try {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const response = await axios.get(`https://diet-maker-d07eb3099e56.herokuapp.com/trainings?date=${formattedDate}`);
        console.log('Fetched trainings:', response.data);
        setTrainings(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching trainings:', error);
        setTrainings([]); // エラーが発生した場合は空の配列を設定
      }
    };

    fetchTrainings();
  }, [selectedDate]);

  const handleAddSet = (trainingIndex) => {
    const lastSet = trainings[trainingIndex].sets[trainings[trainingIndex].sets.length - 1];
    const newSet = {
      weight: lastSet ? lastSet.weight : 85,
      reps: lastSet ? lastSet.reps : 5,
      complete: false,
      timer: lastSet ? lastSet.timer : "02:00"
    };
    const updatedTrainings = trainings.map((training, index) =>
      index === trainingIndex
        ? { ...training, sets: [...(training.sets || []), newSet] } // setsが未定義の場合は空の配列を設定
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
    setCurrentValue(value);
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
    setTrainings([...trainings, newTraining]);
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
    const updatedTrainings = trainings.map((training, index) =>
      index === trainingIndex
        ? { ...training, exercise, targetArea: part }
        : training
    );
    setTrainings(updatedTrainings);
  };

  const confirmEndTraining = () => {
    setConfirmEndModalVisible(true);
  };

  const endTraining = () => {
    setConfirmEndModalVisible(false);
    saveTrainingRecord();
  };

  const saveTrainingRecord = async () => {
    const formattedDate = selectedDate.toISOString().split('T')[0]; // 日付を正しくフォーマット

    const trainingData = trainings.map(training => {
      const workout = Array.isArray(workouts) ? workouts.find(w => w.name === training.exercise) : null;
      console.log('Training:', training.exercise, 'Workout:', workout);
      return training.sets.map(set => ({
        date: formattedDate,
        user_id: 1, // 固定値のuser_idを設定 ログイン機能実装後に変更
        goal_id: null, // 必要に応じて設定
        workout_id: workout ? workout.id : null, // workout_idを追加
        sets: training.sets.length, // セット数
        reps: set.reps,
        weight: set.weight
      }));
    }).flat();

    try {
      // 新しいデータを保存
      const response = await axios.post('https://diet-maker-d07eb3099e56.herokuapp.com/trainings', { training: { trainings: trainingData } });

      if (response.status !== 201) {
        throw new Error('Training data could not be saved');
      }

      setMessage('トレーニングデータの保存に成功しました');
      setMessageClass('save-success-message');
      console.log('Training data saved successfully');
    } catch (error) {
      setMessage('トレーニングデータの保存に失敗しました');
      setMessageClass('save-error-message');
      console.error('Error saving training data:', error);
    }
  };

  const formattedDateDisplay = selectedDate ? selectedDate.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short'
  }) : '日付が選択されていません';

  return (
    <div className="training-record-container">
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileClassName={CalenderTileClassName}
        formatShortWeekday={CalenderFormatShortWeekday}
        tileContent={CalenderTileContent}
      />
      <h2 className="training-record-title">トレーニング記録 : {formattedDateDisplay}</h2>
      {Array.isArray(trainings) && trainings.map((training, trainingIndex) => (
        <div key={trainingIndex} className="training-section">
          <TrainingInfo
            currentExercise={training.exercise}
            currentPart={training.targetArea}
            onExerciseChange={(exercise, part) => handleExerciseChange(trainingIndex, exercise, part)}
          />
          <TrainingTable
            sets={Array.isArray(training.sets) ? training.sets : []} // setsが配列であることを確認
            openModal={(setIndex, field, value) => openModal(trainingIndex, setIndex, field, value)}
            handleUpdateSet={(setIndex, field, value) => handleUpdateSet(trainingIndex, setIndex, field, value)}
            handleRemoveSet={(setIndex) => handleRemoveSet(trainingIndex, setIndex)}
            handleAddSet={() => handleAddSet(trainingIndex)}
          />
          <button className="delete-training-button" onClick={() => confirmDeleteTraining(trainingIndex)}>トレーニング削除</button>
        </div>
      ))}
      <TrainingAdder addTraining={addTraining} />
      {message && <p className={messageClass}>{message}</p>}
      <button className="save-training-button" onClick={confirmEndTraining}>トレーニング終了</button>
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
    </div>
  );
};

export default TrainingRecord;
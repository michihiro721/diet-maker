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
  const [trainingDates, setTrainingDates] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginErrorModalVisible, setLoginErrorModalVisible] = useState(false);

  // ログイン状態の確認
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(!!userId); // userIdがnullまたはundefinedでない場合はtrueに
  }, []);

  useEffect(() => {
    // ワークアウトデータを取得
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get('https://diet-maker-d07eb3099e56.herokuapp.com/workouts');
        setWorkouts(response.data);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchWorkouts();
  }, []);

  // 月が変わった時に、その月のトレーニングデータがある日付を全て取得
  useEffect(() => {
    const fetchMonthlyTrainings = async () => {
      try {
        const userId = localStorage.getItem('userId'); // ユーザーIDを取得
        if (!userId) return;

        // 現在表示されている月の最初と最後の日を計算
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        const firstDayStr = firstDay.toLocaleDateString('en-CA');
        const lastDayStr = lastDay.toLocaleDateString('en-CA');
        
        // 月のトレーニングデータを取得するAPI (バックエンドに実装が必要)
        const response = await axios.get(`https://diet-maker-d07eb3099e56.herokuapp.com/trainings/monthly?start_date=${firstDayStr}&end_date=${lastDayStr}&user_id=${userId}`);
        
        if (response.data && Array.isArray(response.data)) {
          // トレーニングがある日付の配列を作成
          const dates = response.data.map(training => training.date);
          // 重複を削除
          const uniqueDates = [...new Set(dates)];
          setTrainingDates(uniqueDates);
        }
      } catch (error) {
        console.error('Error fetching monthly trainings:', error);
      }
    };

    fetchMonthlyTrainings();
  }, [selectedDate.getFullYear(), selectedDate.getMonth()]);

  useEffect(() => {
    // 選択された日付に基づいてトレーニングデータを取得
    const fetchTrainings = async () => {
      try {
        const formattedDate = selectedDate.toLocaleDateString('en-CA'); // 日付を正しくフォーマット
        const userId = localStorage.getItem('userId');
        
        // ユーザーIDが存在しない場合は何もしない
        if (!userId) {
          setTrainings([]);
          return;
        }
        
        const response = await axios.get(`https://diet-maker-d07eb3099e56.herokuapp.com/trainings?date=${formattedDate}&user_id=${userId}`);
        const data = Array.isArray(response.data) ? response.data : [];
        
        // トレーニングデータを種目ごとにまとめる
        const trainingMap = new Map();
        data.forEach(training => {
          const workout = workouts.find(w => w.id === training.workout_id);
          const exercise = workout ? workout.name : "不明な種目";
          const targetArea = workout ? workout.category : "不明な部位";
          const set = {
            weight: training.weight,
            reps: training.reps,
            timer: "02:00" // タイマーのデフォルト値を設定
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
        console.error('Error fetching trainings:', error);
        setTrainings([]); // エラーが発生した場合は空の配列を設定
      }
    };

    fetchTrainings();
  }, [selectedDate, workouts]);

  // トレーニングデータがある日付かどうかをチェックする関数
  const hasTrainingData = (date) => {
    const dateStr = date.toLocaleDateString('en-CA');
    return trainingDates.includes(dateStr);
  };

  // カレンダータイルのクラス名を決定する関数
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

  const handleAddSet = (trainingIndex) => {
    const lastSet = trainings[trainingIndex].sets && trainings[trainingIndex].sets.length > 0 ? trainings[trainingIndex].sets[trainings[trainingIndex].sets.length - 1] : null;
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
    // ログインしていない場合はエラーモーダルを表示
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

  const saveTrainingRecord = async () => {
    const userId = localStorage.getItem('userId');
    
    // ユーザーIDが存在しない場合は早期リターン
    if (!userId) {
      setMessage('ログインしていないため、トレーニングデータを保存できません');
      setMessageClass('save-error-message');
      return;
    }
    
    const formattedDate = selectedDate.toLocaleDateString('en-CA'); // 日付を正しくフォーマット

    const trainingData = trainings.map(training => {
      const workout = Array.isArray(workouts) ? workouts.find(w => w.name === training.exercise) : null;
      return training.sets.map(set => ({
        date: formattedDate,
        user_id: userId, // 必ずユーザーIDが存在することを確認済み
        goal_id: null, // 必要に応じて設定
        workout_id: workout ? workout.id : null, // workout_idを追加
        sets: training.sets.length, // セット数
        reps: set.reps,
        weight: set.weight
      }));
    }).flat();

    try {
      // 新しいデータを保存
      const response = await axios.post('https://diet-maker-d07eb3099e56.herokuapp.com/trainings', { training: trainingData });

      if (response.status !== 201) {
        throw new Error('Training data could not be saved');
      }
      setMessageClass('save-success-message');
      alert('トレーニングデータの保存に成功しました');
      
      // 月のトレーニングデータを更新
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

  return (
    <div className="training-record-container">
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileClassName={tileClassName}
        formatShortWeekday={CalenderFormatShortWeekday}
        tileContent={CalenderTileContent}
      />
      <h2 className="training-record-title">トレーニング記録 : {formattedDateDisplay}</h2>
      
      {!isLoggedIn && (
        <div className="login-warning-message">
          ログインしないとトレーニングデータを保存できません。<br />
          <a href="/login" className="login-link">ログインする</a>
        </div>
      )}
      
      {Array.isArray(trainings) && trainings.length > 0 ? (
        trainings.map((training, trainingIndex) => (
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
        ))
      ) : (
        <p className="no-training-data">トレーニングデータがありません。</p>
      )}
      <TrainingAdder addTraining={addTraining} />
      {message && <p className={messageClass}>{message}</p>}
      <button 
        className={`save-training-button ${!isLoggedIn ? 'save-training-button-disabled' : ''}`} 
        onClick={confirmEndTraining}
      >
        トレーニング終了
      </button>
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
    </div>
  );
};

export default TrainingRecord;
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

// 有酸素運動の種目リスト
const aerobicExercises = [
  "トレッドミル", "ランニング", "ウォーキング", "エアロバイク", 
  "ストレッチ", "水中ウォーキング", "縄跳び", "スイミング",
  "ジョギング", "エリプティカル", "ステアクライマー", "ローイング",
  "ズンバ", "ヨガ", "ピラティス"
];

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
  const [deleteRecordModalVisible, setDeleteRecordModalVisible] = useState(false); // 記録削除モーダル表示状態

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
          
          // 有酸素運動かどうか判定
          const isAerobic = aerobicExercises.includes(exercise);
          
          // 有酸素運動とそれ以外で保存する項目を変える
          const set = isAerobic ? {
            minutes: training.weight || 30, // weightフィールドを分として使用
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
    const training = trainings[trainingIndex];
    const isAerobic = aerobicExercises.includes(training.exercise);
    const lastSet = training.sets && training.sets.length > 0 ? training.sets[training.sets.length - 1] : null;
    
    // 有酸素運動かそれ以外かで新しいセットの内容を変える
    const newSet = isAerobic 
      ? {
          minutes: lastSet ? lastSet.minutes : 30,
          timer: lastSet ? lastSet.timer : "02:00",
          complete: false
        }
      : {
          weight: lastSet ? lastSet.weight : 20,
          reps: lastSet ? lastSet.reps : 5,
          timer: lastSet ? lastSet.timer : "02:00",
          complete: false
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
    // 有酸素運動かどうかを判定
    const isAerobic = aerobicExercises.includes(newTraining.exercise);
    
    // 有酸素運動の場合はminutesを設定、それ以外はweightとrepsを設定
    const initialSet = isAerobic 
      ? { minutes: 30, timer: "02:00", complete: false }
      : { weight: 20, reps: 5, timer: "02:00", complete: false };
    
    // 新しいトレーニングにセットを追加
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
    // 現在の種目と新しい種目の有酸素状態をチェック
    const currentExercise = trainings[trainingIndex].exercise;
    const wasAerobic = aerobicExercises.includes(currentExercise);
    const isAerobic = aerobicExercises.includes(exercise);
    
    // 有酸素運動からそれ以外、またはその逆に変わる場合
    if (wasAerobic !== isAerobic) {
      // セットの形式を変換
      const convertedSets = trainings[trainingIndex].sets.map(set => {
        if (isAerobic) {
          // 有酸素運動に変更: weightを分に変換
          return {
            minutes: set.weight || 30,
            timer: set.timer || "02:00",
            complete: set.complete || false
          };
        } else {
          // 有酸素運動から通常トレーニングに変更
          return {
            weight: set.minutes || 20,
            reps: 5, // デフォルトの回数
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
      // 有酸素状態が変わらない場合は、単に種目と部位だけ更新
      const updatedTrainings = trainings.map((training, index) =>
        index === trainingIndex
          ? { ...training, exercise, targetArea: part }
          : training
      );
      setTrainings(updatedTrainings);
    }
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

  // トレーニング記録削除の確認モーダルを表示
  const confirmDeleteRecord = () => {
    // ログインしていない場合はエラーモーダルを表示
    if (!isLoggedIn) {
      setLoginErrorModalVisible(true);
      return;
    }
    
    // 記録が存在しない場合は確認なしで終了
    if (!hasTrainingData(selectedDate)) {
      alert('この日付のトレーニング記録は存在しません');
      return;
    }
    
    setDeleteRecordModalVisible(true);
  };

  // トレーニング記録削除の実行
  const deleteTrainingRecord = async () => {
    setDeleteRecordModalVisible(false);
    
    try {
      const userId = localStorage.getItem('userId');
      const formattedDate = selectedDate.toLocaleDateString('en-CA');
      
      // 選択された日付のトレーニング記録を削除するAPIを呼び出す
      const response = await axios.delete(`https://diet-maker-d07eb3099e56.herokuapp.com/trainings`, {
        params: {
          date: formattedDate,
          user_id: userId
        }
      });
      
      if (response.status === 200) {
        // 削除成功
        setTrainings([]);
        
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
        
        alert('トレーニング記録の削除に成功しました');
      } else {
        throw new Error('Training data could not be deleted');
      }
    } catch (error) {
      console.error('Error deleting training record:', error);
      alert('トレーニング記録の削除に失敗しました');
    }
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
      const isAerobic = aerobicExercises.includes(training.exercise);
      
      return training.sets.map(set => ({
        date: formattedDate,
        user_id: userId,
        goal_id: null,
        workout_id: workout ? workout.id : null,
        sets: training.sets.length,
        // 有酸素運動の場合はminutesをweightに保存、repsは0または省略
        weight: isAerobic ? (set.minutes || 30) : (set.weight || 0),
        reps: isAerobic ? 0 : (set.reps || 0)
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
      
      {/* トレーニング記録削除ボタンをタイトルと種目の間に配置 */}
      <div className="delete-record-button-container">
        <button 
          className={`delete-record-button ${!isLoggedIn ? 'delete-record-button-disabled' : ''}`} 
          onClick={confirmDeleteRecord}
        >
          トレーニング記録削除
        </button>
      </div>
      
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
              currentExercise={training.exercise} // 現在の種目名を渡す
              isAerobic={aerobicExercises.includes(training.exercise)} // 有酸素運動かどうかを判定して渡す
            />
            <button className="delete-training-button" onClick={() => confirmDeleteTraining(trainingIndex)}>トレーニング削除</button>
          </div>
        ))
      ) : (
        <p className="no-training-data">トレーニングデータがありません。</p>
      )}
      <TrainingAdder addTraining={addTraining} />
      {message && <p className={messageClass}>{message}</p>}
      
      {/* トレーニング終了ボタンのみ表示 */}
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
      {/* トレーニング記録削除確認モーダル */}
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
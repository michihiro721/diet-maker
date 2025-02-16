// このコードは、トレーニング記録全体を管理および表示するためのコンポーネントです。
// トレーニングの基本情報、セットの詳細、モーダルを使用した入力補助機能を提供します。

import React, { useState } from "react";
import './styles/training-record-container.css';
import TrainingInfo from '../TrainingInfo/TrainingInfo';
import TrainingTable from './TrainingTable';
import Modal from '../Modal/Modal';
import TrainingAdder from './TrainingAdder';

const TrainingRecord = ({ selectedDate, userId }) => {
  const [trainings, setTrainings] = useState([
    {
      exercise: "ベンチプレス",
      targetArea: "胸",
      maxWeight: 100,
      sets: [
        { weight: 85, reps: 5, complete: false, timer: "02:00" },
        { weight: 85, reps: 5, complete: false, timer: "02:00" },
        { weight: 85, reps: 5, complete: false, timer: "02:00" },
      ],
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentSet, setCurrentSet] = useState(null);
  const [currentField, setCurrentField] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [trainingToDelete, setTrainingToDelete] = useState(null);

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
        ? { ...training, sets: [...training.sets, newSet] }
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

  const saveTrainingRecord = () => {
    const trainingData = trainings.map(training => {
      return training.sets.map(set => ({
        date: selectedDate,
        user_id: userId,
        goal_id: null, // 必要に応じて設定
        workout_id: null, // 必要に応じて設定
        sets: set.reps,
        reps: set.reps,
        weight: set.weight
      }));
    }).flat();

    fetch('https://your-heroku-app.herokuapp.com/trainings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trainingData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Training record saved:', data);
      // 必要に応じて追加の処理を行う
    })
    .catch(error => console.error('Error saving training record:', error));
  };

  const formattedDate = selectedDate ? selectedDate.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short'
  }) : '日付が選択されていません';

  return (
    <div className="training-record-container">
      <h2 className="training-record-title">トレーニング記録 : {formattedDate}</h2>
      {trainings.map((training, trainingIndex) => (
        <div key={trainingIndex} className="training-section">
          <TrainingInfo sets={training.sets} />
          <TrainingTable
            sets={training.sets}
            openModal={(setIndex, field, value) => openModal(trainingIndex, setIndex, field, value)}
            handleUpdateSet={(setIndex, field, value) => handleUpdateSet(trainingIndex, setIndex, field, value)}
            handleRemoveSet={(setIndex) => handleRemoveSet(trainingIndex, setIndex)}
            handleAddSet={() => handleAddSet(trainingIndex)}
          />
          <button className="delete-training-button" onClick={() => confirmDeleteTraining(trainingIndex)}>トレーニング削除</button>
        </div>
      ))}
      <TrainingAdder addTraining={addTraining} deleteTraining={deleteTraining} />
      <button className="save-training-button" onClick={saveTrainingRecord}>トレーニング終了</button>
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
    </div>
  );
};

export default TrainingRecord;
import React, { useState } from "react";
import './styles/training-adder.css';

const TrainingAdder = ({ addTraining, deleteTraining }) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState(null);

  const confirmDeleteTraining = (trainingIndex) => {
    setTrainingToDelete(trainingIndex);
    setDeleteModalVisible(true);
  };

  const handleDeleteTraining = () => {
    deleteTraining(trainingToDelete);
    setDeleteModalVisible(false);
  };

  const handleAddTraining = () => {
    const newTraining = {
      exercise: "",
      targetArea: "",
      maxWeight: 0,
      calories: 0,
      sets: [
        { weight: "", reps: "", complete: false, timer: "02:00" },
      ],
    };
    addTraining(newTraining);
  };

  return (
    <div className="training-adder">
      <button className="add-training-button" onClick={handleAddTraining}>トレーニング追加</button>
      {deleteModalVisible && (
        <div className="delete-modal">
          <div className="delete-modal-content">
            <p>本当に削除してもよろしいですか？</p>
            <button className="confirm-button" onClick={handleDeleteTraining}>はい</button>
            <button className="cancel-button" onClick={() => setDeleteModalVisible(false)}>いいえ</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingAdder;
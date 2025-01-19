import React, { useState } from "react";
import CustomizedTraining from '../CustomizedTraining/CustomizedTraining';
import './styles/training-info.css';

const TrainingInfo = () => {
  const [currentExercise, setCurrentExercise] = useState("ベンチプレス");
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleExerciseChange = (exercise) => {
    setCurrentExercise(exercise);
    closeModal();
  };

  return (
    <div className="training-info">
      {/* 種目の情報を表示します */}
      <p>
        種目：
        <span className="exercise-display clickable" onClick={openModal}>
          {currentExercise}
        </span>
      </p>
      {/* 対象部位の情報を表示します */}
      <p>対象部位：胸</p>
      {/* MAX重量の情報を表示します */}
      <p>MAX重量：95kg</p>
      {/* 消費カロリーの情報を表示します */}
      <p>消費カロリー：xxxkcal</p>
      {/* CustomizedTraining コンポーネントを表示 */}
      {modalVisible && (
        <CustomizedTraining
          currentExercise={currentExercise}
          onExerciseChange={handleExerciseChange}
          closeModal={closeModal} // モーダルを閉じる関数を渡す
        />
      )}
    </div>
  );
};

export default TrainingInfo;
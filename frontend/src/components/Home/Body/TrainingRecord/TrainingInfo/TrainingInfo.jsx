// このファイルは、トレーニング情報を表示するコンポーネントを定義しています。
// ユーザーが選択したトレーニング種目とその対象部位を表示し、
// モーダルウィンドウを通じて種目を変更できるインターフェースを提供します。

import React, { useState } from "react";
import CustomizedTraining from '../CustomizedTraining/CustomizedTraining';
import './styles/training-info.css';

const TrainingInfo = ({ currentExercise, currentPart, onExerciseChange }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleExerciseChange = (exercise, part) => {
    onExerciseChange(exercise, part);
    closeModal();
  };

  return (
    <div className="training-info">
      <p>
        種目：
        <span className="exercise-display clickable" onClick={openModal}>
          {currentExercise}
        </span>
      </p>
      <p className="target-part">対象部位：{currentPart}</p>
      <p>MAX重量：本リリース時に実装予定</p>
      <p>消費カロリー：本リリース時に実装予定</p>
      {modalVisible && (
        <CustomizedTraining
          currentExercise={currentExercise}
          onExerciseChange={handleExerciseChange}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default TrainingInfo;
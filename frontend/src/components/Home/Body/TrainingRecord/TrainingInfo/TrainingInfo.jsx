// このファイルは、トレーニング情報を表示するコンポーネントを定義しています。
// ユーザーが選択したトレーニング種目とその対象部位を表示し、
// モーダルウィンドウを通じて種目を変更できるインターフェースを提供します。

import React, { useState, useEffect } from "react";
import CustomizedTraining from '../CustomizedTraining/CustomizedTraining';
import './styles/training-info.css';

// 有酸素運動の種目リスト
const aerobicExercises = [
  "トレッドミル", "ランニング", "ウォーキング", "エアロバイク", 
  "ストレッチ", "水中ウォーキング", "縄跳び", "階段",
];

const TrainingInfo = ({ currentExercise, currentPart, onExerciseChange, maxWeight }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isAerobic, setIsAerobic] = useState(false);

  // 有酸素運動かどうかチェック
  useEffect(() => {
    setIsAerobic(aerobicExercises.includes(currentExercise));
  }, [currentExercise]);

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
      {!isAerobic && <p>MAX重量：{maxWeight || 'トレーニングデータなし'}</p>}
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

// 有酸素運動の種目リストをエクスポート
export { aerobicExercises };
export default TrainingInfo;
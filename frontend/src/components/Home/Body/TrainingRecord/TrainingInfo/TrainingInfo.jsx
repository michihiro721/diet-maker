// このファイルは、トレーニング情報を表示するコンポーネントを定義しています。
// ユーザーが選択したトレーニング種目とその対象部位を表示し、
// モーダルウィンドウを通じて種目を変更できるインターフェースを提供します。

import React, { useState } from "react";
import CustomizedTraining from '../CustomizedTraining/CustomizedTraining';
import './styles/training-info.css';

const TrainingInfo = () => {
  // 現在選択されている種目を管理する状態
  const [currentExercise, setCurrentExercise] = useState("ベンチプレス");
  // 現在選択されている部位を管理する状態
  const [currentPart, setCurrentPart] = useState("胸");
  // モーダルの表示状態を管理する状態
  const [modalVisible, setModalVisible] = useState(false);

  // モーダルを開く処理
  const openModal = () => {
    setModalVisible(true);
  };

  // モーダルを閉じる処理
  const closeModal = () => {
    setModalVisible(false);
  };

  // 種目が変更されたときの処理
  const handleExerciseChange = (exercise, part) => {
    setCurrentExercise(exercise); // 選択された種目を更新
    setCurrentPart(part); // 選択された部位を更新
    closeModal(); // モーダルを閉じる
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
      <p className="target-part">対象部位：{currentPart}</p>
      {/* MAX重量の情報を表示します */}
      <p>MAX重量：本リリース時に実装予定</p>
      {/* 消費カロリーの情報を表示します */}
      <p>消費カロリー：本リリース時に実装予定</p>
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
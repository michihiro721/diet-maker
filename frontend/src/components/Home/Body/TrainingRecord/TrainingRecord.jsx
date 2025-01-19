// このコードは、トレーニング記録全体を管理および表示するためのコンポーネントです。
// トレーニングの基本情報、セットの詳細、モーダルを使用した入力補助機能を提供します。

import React, { useState } from "react";
import './styles/training-record-container.css';
import './styles/training-info.css';
import './styles/training-table.css';
import './styles/modal.css';
import './styles/calculator.css';
import './styles/timer.css';
import TrainingInfo from './TrainingInfo';
import TrainingTable from './TrainingTable';
import Modal from './Modal';

const TrainingRecord = () => {
  // トレーニングのセット情報を管理する状態
  const [sets, setSets] = useState([
    { weight: 85, reps: 5, complete: false, timer: "02:00" },
    { weight: 85, reps: 5, complete: false, timer: "02:00" },
    { weight: 85, reps: 5, complete: false, timer: "02:00" },
  ]);

  // モーダルの表示状態を管理する状態
  const [modalVisible, setModalVisible] = useState(false);
  // 現在編集中のセットのインデックスを管理する状態
  const [currentSet, setCurrentSet] = useState(null);
  // 現在編集中のフィールド名を管理する状態
  const [currentField, setCurrentField] = useState("");
  // 現在編集中の値を管理する状態
  const [currentValue, setCurrentValue] = useState("");

  // 新しいセットを追加する関数
  const handleAddSet = () => {
    setSets([...sets, { weight: 85, reps: 5, complete: false, timer: "02:00" }]);
  };

  // 指定されたインデックスのセットを削除する関数
  const handleRemoveSet = (index) => {
    const updatedSets = sets.filter((_, i) => i !== index);
    setSets(updatedSets);
  };

  // 指定されたインデックスのセットのフィールドを更新する関数
  const handleUpdateSet = (index, field, value) => {
    const updatedSets = sets.map((set, i) =>
      i === index ? { ...set, [field]: value } : set
    );
    setSets(updatedSets);
  };

  // モーダルを開く関数
  const openModal = (index, field, value) => {
    setCurrentSet(index);
    setCurrentField(field);
    setCurrentValue(value);
    setModalVisible(true);
  };

  // モーダルを閉じる関数
  const closeModal = () => {
    setModalVisible(false);
  };

  // モーダルの保存ボタンがクリックされたときの処理
  const handleModalSave = () => {
    handleUpdateSet(currentSet, currentField, currentValue);
    closeModal();
  };

  // モーダルの外側がクリックされたときの処理
  const handleClickOutside = (event) => {
    if (event.target.className === "modal") {
      closeModal();
    }
  };

  return (
    <div className="training-record-container">
      <h2 className="training-record-title">トレーニング記録 : 12月15日（木）</h2>
      {/* トレーニングの基本情報を表示 */}
      <TrainingInfo />
      {/* トレーニングのセット情報を表示 */}
      <TrainingTable
        sets={sets}
        openModal={openModal}
        handleUpdateSet={handleUpdateSet}
        handleRemoveSet={handleRemoveSet}
        handleAddSet={handleAddSet}
      />
      {/* モーダルが表示されている場合 */}
      {modalVisible && (
        <Modal
          currentField={currentField}
          currentValue={currentValue}
          setCurrentValue={setCurrentValue}
          handleModalSave={handleModalSave}
          handleClickOutside={handleClickOutside}
        />
      )}
    </div>
  );
};

export default TrainingRecord;
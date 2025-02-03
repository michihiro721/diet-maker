// このコードは、トレーニング記録全体を管理および表示するためのコンポーネントです。
// トレーニングの基本情報、セットの詳細、モーダルを使用した入力補助機能を提供します。

import React, { useState } from "react";
import './styles/training-record-container.css';
import TrainingInfo from '../TrainingInfo/TrainingInfo';
import TrainingTable from './TrainingTable';
import Modal from '../Modal/Modal';

const TrainingRecord = ({ selectedDate }) => {
  const [sets, setSets] = useState([
    { weight: 85, reps: 5, complete: false, timer: "02:00" },
    { weight: 85, reps: 5, complete: false, timer: "02:00" },
    { weight: 85, reps: 5, complete: false, timer: "02:00" },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [currentSet, setCurrentSet] = useState(null);
  const [currentField, setCurrentField] = useState("");
  const [currentValue, setCurrentValue] = useState("");

  const handleAddSet = () => {
    const lastSet = sets[sets.length - 1];
    const newSet = {
      weight: lastSet ? lastSet.weight : 85,
      reps: lastSet ? lastSet.reps : 5,
      complete: false,
      timer: lastSet ? lastSet.timer : "02:00"
    };
    setSets([...sets, newSet]);
  };

  const handleRemoveSet = (index) => {
    const updatedSets = sets.filter((_, i) => i !== index);
    setSets(updatedSets);
  };

  const handleUpdateSet = (index, field, value) => {
    const updatedSets = sets.map((set, i) =>
      i === index ? { ...set, [field]: value } : set
    );
    setSets(updatedSets);
  };

  const openModal = (index, field, value) => {
    setCurrentSet(index);
    setCurrentField(field);
    setCurrentValue(value);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleModalSave = () => {
    handleUpdateSet(currentSet, currentField, currentValue);
    closeModal();
  };

  const handleClickOutside = (event) => {
    if (event.target.className === "modal") {
      closeModal();
    }
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
      <TrainingInfo />
      <TrainingTable
        sets={sets}
        openModal={openModal}
        handleUpdateSet={handleUpdateSet}
        handleRemoveSet={handleRemoveSet}
        handleAddSet={handleAddSet}
      />
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
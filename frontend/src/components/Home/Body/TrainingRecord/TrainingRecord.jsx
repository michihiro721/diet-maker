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
    setSets([...sets, { weight: 85, reps: 5, complete: false, timer: "02:00" }]);
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

  return (
    <div className="training-record-container">
      <h2 className="training-record-title">トレーニング記録 : 12月15日（木）</h2>
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
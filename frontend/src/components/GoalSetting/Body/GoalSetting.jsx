import React, { useState } from "react";
import Header from "../Header/Header";
import "./styles/GoalSetting.css";

const GoalSetting = () => {
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalValue, setModalValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // 設定ボタンがクリックされたときの処理をここに追加
    console.log("現在の体重:", currentWeight);
    console.log("目標体重:", targetWeight);
    console.log("目標達成予定日:", targetDate);
  };

  const openModal = (type) => {
    setModalType(type);
    setModalValue(type === "currentWeight" ? currentWeight : targetWeight);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (modalType === "currentWeight") {
      setCurrentWeight(modalValue);
    } else {
      setTargetWeight(modalValue);
    }
    setIsModalOpen(false);
  };

  const handleCalculatorClick = (value) => {
    setModalValue((prev) => prev.toString() + value);
  };

  const handleBackspace = () => {
    setModalValue((prev) => prev.toString().slice(0, -1));
  };

  const handleModalSave = () => {
    closeModal();
  };

  const handleClickOutside = (e) => {
    if (e.target.className === "modal") {
      closeModal();
    }
  };

  return (
    <div>
      <Header title="目標設定" />
      <h1>目標設定</h1>
      <form className="goal-setting-form" onSubmit={handleSubmit}>
        <div>
          <label className="goal-setting-label">現在の体重:</label>
          <input
            type="number"
            className="goal-setting-input"
            value={currentWeight}
            onClick={() => openModal("currentWeight")}
            readOnly
          />
        </div>
        <div>
          <label className="goal-setting-label">目標体重:</label>
          <input
            type="number"
            className="goal-setting-input"
            value={targetWeight}
            onClick={() => openModal("targetWeight")}
            readOnly
          />
        </div>
        <div>
          <label className="goal-setting-label">目標達成予定日:</label>
          <input
            type="date"
            className="goal-setting-input"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>
        <button type="submit" className="goal-setting-button">設定</button>
      </form>

      {isModalOpen && (
        <div className="modal" style={{ display: 'block' }} onClick={handleClickOutside}>
          <div className="modal-content">
            <input
              type="text"
              className="keyboard-input"
              value={modalValue}
              readOnly
            />
            <div className="calculator-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "."].map((num) => (
                <button key={num} onClick={() => handleCalculatorClick(num)}>{num}</button>
              ))}
              <button onClick={handleBackspace}>←</button>
            </div>
            <button className="modal-button" onClick={handleModalSave}>保存</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalSetting;
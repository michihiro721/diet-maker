import React, { useState } from "react";
import './training record.css'; // CSSファイルをインポート

const TrainingRecord = () => {
  const [sets, setSets] = useState([
    { weight: 85, reps: 5, complete: false, timer: "2:00" },
    { weight: 85, reps: 5, complete: false, timer: "2:00" },
    { weight: 85, reps: 5, complete: false, timer: "2:00" },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [currentSet, setCurrentSet] = useState(null);
  const [currentField, setCurrentField] = useState("");
  const [currentValue, setCurrentValue] = useState("");

  const handleAddSet = () => {
    setSets([...sets, { weight: 85, reps: 5, complete: false, timer: "2:00" }]);
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

  const handleCalculatorClick = (value) => {
    setCurrentValue((prev) => prev + value);
  };

  const handleBackspace = () => {
    setCurrentValue((prev) => prev.slice(0, -1));
  };

  const handleIncrement = (increment) => {
    setCurrentValue((prev) => (parseFloat(prev) + increment).toString());
  };

  const handleDecrement = (decrement) => {
    setCurrentValue((prev) => (parseFloat(prev) - decrement).toString());
  };

  return (
    <div className="training-record-container">
      <h2 className="training-record-title">トレーニング記録 : 12月15日（木）</h2>
      <div className="training-info">
        <p>
          種目：<input type="text" defaultValue="ベンチプレス" readOnly />
        </p>
        <p>対象部位：胸</p>
        <p>MAX重量：95kg</p>
        <p>消費カロリー：xxxkcal</p>
      </div>

      <table className="training-table">
        <thead>
          <tr>
            <th>セット</th>
            <th>kg</th>
            <th>回</th>
            <th>タイマー</th>
            <th>完了</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {sets.map((set, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="number"
                  value={set.weight}
                  onClick={() => openModal(index, "weight", set.weight)}
                  readOnly
                />
              </td>
              <td>
                <input
                  type="number"
                  value={set.reps}
                  onClick={() => openModal(index, "reps", set.reps)}
                  readOnly
                />
              </td>
              <td>
                <input
                  type="text"
                  value={set.timer}
                  onClick={() => openModal(index, "timer", set.timer)}
                  readOnly
                />
              </td>
              <td>
                <button
                  onClick={() => handleUpdateSet(index, "complete", !set.complete)}
                  className={set.complete ? "complete-button" : "incomplete-button"}
                >
                  {set.complete ? "レ" : ""}
                </button>
              </td>
              <td>
                <button
                  onClick={() => handleRemoveSet(index)}
                  className="delete-button"
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="add-set-button-container">
        <button
          onClick={handleAddSet}
          className="add-set-button"
        >
          + セット追加
        </button>
      </div>

      {modalVisible && (
        <div className="modal" style={{ display: 'block' }} onClick={handleClickOutside}>
          <div className="modal-content">
            <input
              type="text"
              className="keyboard-input"
              value={currentValue}
              readOnly
            />
            <div className="calculator-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "."].map((num) => (
                <button
                  key={num}
                  className="calculator-button"
                  onClick={() => handleCalculatorClick(num.toString())}
                >
                  {num}
                </button>
              ))}
              <button className="calculator-button" onClick={handleBackspace}>&larr;</button>
            </div>
            <div className="calculator-grid-extended">
              <button className="calculator-button" onClick={() => handleIncrement(1)}>+1</button>
              <button className="calculator-button" onClick={() => handleDecrement(1)}>-1</button>
              <button className="calculator-button" onClick={() => handleIncrement(2.5)}>+2.5</button>
              <button className="calculator-button" onClick={() => handleDecrement(2.5)}>-2.5</button>
              <button className="calculator-button" onClick={() => handleIncrement(5)}>+5</button>
              <button className="calculator-button" onClick={() => handleDecrement(5)}>-5</button>
            </div>
            <button className="modal-button" onClick={handleModalSave}>保存</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingRecord;
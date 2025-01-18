import React, { useState } from "react";
import './training record.css'; // CSSファイルをインポート

const TrainingRecord = () => {
  // トレーニングセットの状態を管理するためのuseStateフック
  const [sets, setSets] = useState([
    { weight: 85, reps: 5, complete: false, timer: "02:00" },
    { weight: 85, reps: 5, complete: false, timer: "02:00" },
    { weight: 85, reps: 5, complete: false, timer: "02:00" },
  ]);

  // モーダルウィンドウの表示状態を管理するためのuseStateフック
  const [modalVisible, setModalVisible] = useState(false);
  // 現在編集中のセットのインデックスを管理するためのuseStateフック
  const [currentSet, setCurrentSet] = useState(null);
  // 現在編集中のフィールドを管理するためのuseStateフック
  const [currentField, setCurrentField] = useState("");
  // 現在編集中の値を管理するためのuseStateフック
  const [currentValue, setCurrentValue] = useState("");

  // 新しいセットを追加する関数
  const handleAddSet = () => {
    setSets([...sets, { weight: 85, reps: 5, complete: false, timer: "02:00" }]);
  };

  // 指定したインデックスのセットを削除する関数
  const handleRemoveSet = (index) => {
    const updatedSets = sets.filter((_, i) => i !== index);
    setSets(updatedSets);
  };

  // 指定したインデックスのセットのフィールドを更新する関数
  const handleUpdateSet = (index, field, value) => {
    const updatedSets = sets.map((set, i) =>
      i === index ? { ...set, [field]: value } : set
    );
    setSets(updatedSets);
  };

  // モーダルウィンドウを開く関数
  const openModal = (index, field, value) => {
    setCurrentSet(index);
    setCurrentField(field);
    setCurrentValue(value);
    setModalVisible(true);
  };

  // モーダルウィンドウを閉じる関数
  const closeModal = () => {
    setModalVisible(false);
  };

  // モーダルウィンドウの保存ボタンをクリックしたときの関数
  const handleModalSave = () => {
    handleUpdateSet(currentSet, currentField, currentValue);
    closeModal();
  };

  // モーダルウィンドウの外側をクリックしたときにモーダルを閉じる関数
  const handleClickOutside = (event) => {
    if (event.target.className === "modal") {
      closeModal();
    }
  };

  // 電卓ボタンをクリックしたときの関数
  const handleCalculatorClick = (value) => {
    setCurrentValue((prev) => prev.toString() + value);
  };

  // バックスペースボタンをクリックしたときの関数
  const handleBackspace = () => {
    setCurrentValue((prev) => prev.toString().slice(0, -1));
  };

  // タイマーボタンをクリックしたときの関数
  const handleTimerSelect = (value) => {
    setCurrentValue(value);
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
          <div className={`modal-content ${currentField === "timer" ? "timer-modal-content" : ""}`}>
            <input
              type="text"
              className="keyboard-input"
              value={currentValue}
              readOnly
            />
            {currentField === "timer" ? (
              <div className="timer-options">
                {["00:30", "01:30", "02:00", "03:00", "04:00", "05:00"].map((time) => (
                  <button
                    key={time}
                    className="timer-button"
                    onClick={() => handleTimerSelect(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <div className="calculator-grid">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                  <button
                    key={num}
                    className="calculator-button"
                    onClick={() => handleCalculatorClick(num.toString())}
                  >
                    {num}
                  </button>
                ))}
                <button className="calculator-button" onClick={() => handleCalculatorClick(".")}>.</button>
                <button className="calculator-button" onClick={handleBackspace}>&larr;</button>
              </div>
            )}
            <button className="modal-button" onClick={handleModalSave}>保存</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingRecord;
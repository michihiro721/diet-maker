import React from "react";
import './styles/modal.css';
import TimerOptions from '../TimerOptions/TimerOptions';
import CalculatorGrid from '../CalculatorGrid/CalculatorGrid';

const Modal = ({ currentField, currentValue, setCurrentValue, handleModalSave, handleClickOutside }) => {
  // 電卓のボタンがクリックされたときの処理
  const handleCalculatorClick = (value) => {
    setCurrentValue((prev) => prev.toString() + value);
  };

  // バックスペースボタンがクリックされたときの処理
  const handleBackspace = () => {
    setCurrentValue((prev) => prev.toString().slice(0, -1));
  };

  // タイマーオプションが選択されたときの処理
  const handleTimerSelect = (value) => {
    setCurrentValue(value);
  };

  return (
    <div className="modal" style={{ display: 'block' }} onClick={handleClickOutside}>
      <div className={`modal-content ${currentField === "timer" ? "timer-modal-content" : ""}`}>
        {/* 現在の値を表示する入力フィールド */}
        <input
          type="text"
          className="keyboard-input"
          value={currentValue}
          readOnly
        />
        {currentField === "timer" ? (
          <TimerOptions handleTimerSelect={handleTimerSelect} />
        ) : (
          <CalculatorGrid
            handleCalculatorClick={handleCalculatorClick}
            handleBackspace={handleBackspace}
          />
        )}
        {/* 保存ボタン */}
        <button className="modal-button" onClick={handleModalSave}>保存</button>
      </div>
    </div>
  );
};

export default Modal;
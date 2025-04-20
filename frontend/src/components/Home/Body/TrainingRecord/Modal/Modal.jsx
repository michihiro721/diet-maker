import React from "react";
import PropTypes from 'prop-types';
import './styles/modal.css';
import TimerOptions from '../TimerOptions/TimerOptions';
import CalculatorGrid from '../CalculatorGrid/CalculatorGrid';

const Modal = ({ currentField, currentValue, setCurrentValue, handleModalSave, handleClickOutside }) => {
  const handleCalculatorClick = (value) => {
    setCurrentValue((prev) => prev.toString() + value);
  };

  const handleBackspace = () => {
    setCurrentValue((prev) => prev.toString().slice(0, -1));
  };

  const handleTimerSelect = (value) => {
    setCurrentValue(value);
  };

  return (
    <div className="modal" style={{ display: 'block' }} onClick={handleClickOutside}>
      <div className={`modal-content ${currentField === "timer" ? "timer-modal-content" : ""}`}>
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

        <button className="modal-button" onClick={handleModalSave}>保存</button>
      </div>
    </div>
  );
};


Modal.propTypes = {
  currentField: PropTypes.string.isRequired,
  currentValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  setCurrentValue: PropTypes.func.isRequired,
  handleModalSave: PropTypes.func.isRequired,
  handleClickOutside: PropTypes.func.isRequired
};

export default Modal;
import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import './styles/TrainingCalculatorModal.css';

const TrainingCalculatorModal = ({ isOpen, onClose, onSave, initialValue }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue ? String(initialValue) : "");
    }
  }, [isOpen, initialValue]);

  const handleCalculatorClick = (num) => {
    setValue((prevValue) => prevValue + num);
  };

  const handleBackspace = () => {
    setValue((prevValue) => {
      const stringValue = String(prevValue);
      return stringValue.slice(0, -1);
    });
  };

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="training-calculator-overlay" onClick={onClose}>
      <div className="training-calculator-modal" onClick={(e) => e.stopPropagation()}>
        <div className="training-calculator-display fixed-size">{value}</div>
        <div className="training-calculator-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
            <button
              key={num}
              className="training-calculator-button"
              onClick={() => handleCalculatorClick(num.toString())}
            >
              {num}
            </button>
          ))}
          <button className="training-calculator-button" onClick={() => handleCalculatorClick(".")}>.</button>
          <button className="training-calculator-button" onClick={handleBackspace}>&larr;</button>
          <button className="training-calculator-preservation-button" onClick={handleSave}>保存</button>
        </div>
      </div>
    </div>
  );
};

TrainingCalculatorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default TrainingCalculatorModal;
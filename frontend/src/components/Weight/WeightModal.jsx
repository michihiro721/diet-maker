import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import './styles/WeightModal.css';

const WeightModal = ({ isOpen, onClose, onSave }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      setValue("");
    }
  }, [isOpen]);

  const handleCalculatorClick = (num) => {
    setValue(value + num);
  };

  const handleBackspace = () => {
    setValue(value.slice(0, -1));
  };

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="weight-modal-overlay" onClick={onClose}>
      <div className="weight-modal" onClick={(e) => e.stopPropagation()}>
        <div className="weight-modal-display fixed-size">{value}</div>
        <div className="weight-modal-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
            <button
              key={num}
              className="weight-modal-button"
              onClick={() => handleCalculatorClick(num.toString())}
            >
              {num}
            </button>
          ))}
          <button className="weight-modal-button" onClick={() => handleCalculatorClick(".")}>.</button>
          <button className="weight-modal-button" onClick={handleBackspace}>&larr;</button>
          <button className="weight-modal-preservation-button" onClick={handleSave}>保存</button>
        </div>
      </div>
    </div>
  );
};


WeightModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default WeightModal;
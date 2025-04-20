import React from "react";
import PropTypes from 'prop-types';
import './styles/PartSelector.css';

const PartSelector = ({ selectedPart, handlePartChange, exercises }) => {
  return (
    // 部位選択ボタンのコンテナ
    <div className="part-selector">
      {Object.keys(exercises).map((part) => (
        <button
          key={part}
          className={`part-button ${part === selectedPart ? "active" : ""}`}
          onClick={() => handlePartChange(part)}
        >
          {part}
        </button>
      ))}
    </div>
  );
};


PartSelector.propTypes = {
  selectedPart: PropTypes.string.isRequired,
  handlePartChange: PropTypes.func.isRequired,
  exercises: PropTypes.objectOf(
    PropTypes.arrayOf(PropTypes.string)
  ).isRequired
};

export default PartSelector;
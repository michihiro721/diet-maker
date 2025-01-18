import React from "react";
import './styles/calculator.css';

const CalculatorGrid = ({ handleCalculatorClick, handleBackspace }) => (
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
);

export default CalculatorGrid;
import React from "react";
import './styles/calculator.css';
const CalculatorGrid = ({ handleCalculatorClick, handleBackspace }) => (
  <div className="calculator-grid">
    {/* 数字ボタンを表示します */}
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
      <button
        key={num}
        className="calculator-button"
        onClick={() => handleCalculatorClick(num.toString())}
      >
        {num}
      </button>
    ))}
    {/* 小数点ボタンを表示します */}
    <button className="calculator-button" onClick={() => handleCalculatorClick(".")}>.</button>
    {/* バックスペースボタンを表示します */}
    <button className="calculator-button" onClick={handleBackspace}>&larr;</button>
  </div>
);

export default CalculatorGrid;
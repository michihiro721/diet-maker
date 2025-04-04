import React from "react";
import './styles/add-set-button.css';

const AddSetButton = ({ handleAddSet }) => (
  <div className="add-set-button-container">
    <button
      onClick={handleAddSet}
      className="add-set-button"
    >
      + セット追加
    </button>
  </div>
);

export default AddSetButton;
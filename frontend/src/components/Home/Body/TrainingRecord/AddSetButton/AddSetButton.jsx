import React from "react";
import PropTypes from 'prop-types';
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

AddSetButton.propTypes = {
  handleAddSet: PropTypes.func.isRequired
};

export default AddSetButton;
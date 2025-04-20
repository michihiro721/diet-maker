import React, { useState } from "react";
import PropTypes from 'prop-types';
import AlertFunction from '../AlertFunction/AlertFunction';

const TrainingTableRowButton = ({ index, set, handleUpdateSet, handleRemoveSet }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);

  const handleCompleteClick = () => {
    if (set.complete) {
      setResetTimer(true);
      setShowAlert(false);
    } else {
      setShowAlert(true);
      setResetTimer(false);
    }

    handleUpdateSet(index, "complete", !set.complete);
  };


  const handleAlertComplete = () => {
    setShowAlert(false);
  };


  const updateTimer = (newTime) => {
    const minutes = Math.floor(newTime / 60);
    const seconds = newTime % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    handleUpdateSet(index, "timer", formattedTime);
  };

  return (
    <>
      <button
        onClick={handleCompleteClick}
        className={set.complete ? "complete-button" : "incomplete-button"}
      >
        {set.complete ? "レ" : ""}
      </button>
      {showAlert && (
        <AlertFunction
          timer={parseInt(set.timer.split(':').reduce((acc, time) => (60 * acc) + +time))}
          onComplete={handleAlertComplete}
          updateTimer={updateTimer}
          reset={resetTimer}
        />
      )}
      <button
        onClick={() => handleRemoveSet(index)}
        className="delete-button"
      >
        削除
      </button>
    </>
  );
};


TrainingTableRowButton.propTypes = {
  index: PropTypes.number.isRequired,
  set: PropTypes.shape({
    complete: PropTypes.bool,
    timer: PropTypes.string,
  }).isRequired,
  handleUpdateSet: PropTypes.func.isRequired,
  handleRemoveSet: PropTypes.func.isRequired
};

export default TrainingTableRowButton;
import React, { useState } from "react";
import PropTypes from 'prop-types';
import TrainingCopyModal from "../../../../Posts/TrainingCopyModal";
import "./styles/TrainingCopyButton.css";

const TrainingCopyButton = ({ trainings, workouts, onTrainingCopied }) => {
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const userId = localStorage.getItem('userId');
  const hasTrainingData = trainings && trainings.length > 0;
  
  const formatTrainingData = () => {
    if (!hasTrainingData) {
      return [];
    }

    return trainings.flatMap(training => {
      const workout = workouts.find(w => w.name === training.exercise);

      if (!workout) {
        return [];
      }

      return training.sets.map((set, index) => {
        const isAerobic = Object.prototype.hasOwnProperty.call(set, 'reps') === false;

        return {
          workout_id: workout.id,
          sets: index + 1,
          weight: isAerobic ? set.minutes : set.weight,
          reps: isAerobic ? 0 : set.reps
        };
      });
    });
  };

  const openCopyModal = () => {
    if (!userId) {
      alert("ログインしていないとトレーニングデータをコピーできません。");
      return;
    }

    if (!hasTrainingData) {
      alert("コピーするトレーニングデータがありません。");
      return;
    }

    setIsCopyModalOpen(true);
  };

  const closeCopyModal = (success = false) => {
    setIsCopyModalOpen(false);
    if (success && onTrainingCopied) {
      onTrainingCopied();
    }
  };

  if (!hasTrainingData) {
    return null;
  }

  return (
    <>
      <div className="training-copy-container">
        <button
          className="training-copy-button"
          onClick={openCopyModal}
          disabled={!userId}
        >
          メニューをコピー
        </button>
      </div>
      
      {isCopyModalOpen && (
        <TrainingCopyModal
          isOpen={isCopyModalOpen}
          onClose={closeCopyModal}
          trainingData={formatTrainingData()}
          userId={userId}
        />
      )}
    </>
  );
};

TrainingCopyButton.propTypes = {
  trainings: PropTypes.arrayOf(
    PropTypes.shape({
      exercise: PropTypes.string,
      sets: PropTypes.array.isRequired
    })
  ),
  workouts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired
    })
  ),
  onTrainingCopied: PropTypes.func
};

export default TrainingCopyButton;
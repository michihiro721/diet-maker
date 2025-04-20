import React from "react";
import PropTypes from 'prop-types';
import './styles/ExerciseList.css';

const ExerciseList = ({ filteredExercises, handleExerciseSelect }) => {
  return (
    <div className="exercise-list">
      {filteredExercises.map((exercise) => (
        <p
          key={exercise}
          className="exercise-item"
          onClick={() => handleExerciseSelect(exercise)}
        >
          {exercise}
        </p>
      ))}
    </div>
  );
};

ExerciseList.propTypes = {
  filteredExercises: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleExerciseSelect: PropTypes.func.isRequired
};

export default ExerciseList;
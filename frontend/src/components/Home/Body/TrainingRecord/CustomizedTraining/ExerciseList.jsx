import React from "react";
import PropTypes from 'prop-types';
import './styles/ExerciseList.css';

const ExerciseList = ({ filteredExercises, handleExerciseSelect }) => {
  return (
    // トレーニング種目リストのコンテナ
    <div className="exercise-list">
      {/* フィルタリングされたトレーニング種目をマッピングして表示 */}
      {filteredExercises.map((exercise) => (
        // トレーニング種目アイテム
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
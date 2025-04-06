import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import TrainingTableHeader from './TrainingTableHeader';
import TrainingTableBody from './TrainingTableBody';
import AddSetButton from '../AddSetButton/AddSetButton';
import { aerobicExercises } from '../TrainingInfo/TrainingInfo';
import './styles/training-table.css';

const TrainingTable = ({ sets, openModal, handleUpdateSet, handleRemoveSet, handleAddSet, currentExercise }) => {
  const [isAerobic, setIsAerobic] = useState(false);

  // 有酸素運動かどうかを判定
  useEffect(() => {
    setIsAerobic(aerobicExercises.includes(currentExercise));
  }, [currentExercise]);

  return (
    <>
      <table className="training-table">
        {/* テーブルのヘッダーを表示 */}
        <TrainingTableHeader isAerobic={isAerobic} />
        {/* テーブルのボディを表示 */}
        <TrainingTableBody
          sets={sets}
          openModal={openModal}
          handleUpdateSet={handleUpdateSet}
          handleRemoveSet={handleRemoveSet}
          isAerobic={isAerobic}
        />
      </table>
      {/* セット追加ボタンを表示 */}
      <AddSetButton handleAddSet={handleAddSet} />
    </>
  );
};


TrainingTable.propTypes = {
  sets: PropTypes.array.isRequired,
  openModal: PropTypes.func.isRequired,
  handleUpdateSet: PropTypes.func.isRequired,
  handleRemoveSet: PropTypes.func.isRequired,
  handleAddSet: PropTypes.func.isRequired,
  currentExercise: PropTypes.string
};

export default TrainingTable;
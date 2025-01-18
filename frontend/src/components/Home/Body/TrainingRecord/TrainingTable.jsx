import React from "react";
import TrainingTableHeader from './TrainingTableHeader';
import TrainingTableBody from './TrainingTableBody';
import AddSetButton from './AddSetButton';
import './styles/training-table.css';

const TrainingTable = ({ sets, openModal, handleUpdateSet, handleRemoveSet, handleAddSet }) => (
  <>
    <table className="training-table">
      <TrainingTableHeader />
      <TrainingTableBody
        sets={sets}
        openModal={openModal}
        handleUpdateSet={handleUpdateSet}
        handleRemoveSet={handleRemoveSet}
      />
    </table>
    <AddSetButton handleAddSet={handleAddSet} />
  </>
);

export default TrainingTable;
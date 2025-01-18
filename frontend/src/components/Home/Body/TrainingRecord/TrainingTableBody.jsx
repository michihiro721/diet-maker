import React from "react";
import TrainingTableRow from './TrainingTableRow';
import './styles/training-table-body.css';

const TrainingTableBody = ({ sets, openModal, handleUpdateSet, handleRemoveSet }) => (
  <tbody>
    {sets.map((set, index) => (
      <TrainingTableRow
        key={index}
        index={index}
        set={set}
        openModal={openModal}
        handleUpdateSet={handleUpdateSet}
        handleRemoveSet={handleRemoveSet}
      />
    ))}
  </tbody>
);

export default TrainingTableBody;
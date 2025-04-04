import React from "react";
import TrainingTableRow from './TrainingTableRow';

const TrainingTableBody = ({ sets, openModal, handleUpdateSet, handleRemoveSet, isAerobic }) => (
  <tbody>
    {Array.isArray(sets) && sets.map((set, index) => (
      <TrainingTableRow
        key={index}
        index={index}
        set={set}
        openModal={openModal}
        handleUpdateSet={handleUpdateSet}
        handleRemoveSet={handleRemoveSet}
        isAerobic={isAerobic}
      />
    ))}
  </tbody>
);

export default TrainingTableBody;
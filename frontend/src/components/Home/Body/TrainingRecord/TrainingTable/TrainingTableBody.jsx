import React from "react";
import PropTypes from 'prop-types';
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


TrainingTableBody.propTypes = {
  sets: PropTypes.array,
  openModal: PropTypes.func.isRequired,
  handleUpdateSet: PropTypes.func.isRequired,
  handleRemoveSet: PropTypes.func.isRequired,
  isAerobic: PropTypes.bool.isRequired
};

export default TrainingTableBody;
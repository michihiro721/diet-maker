import React from "react";
import './styles/training-table-row.css';

const TrainingTableRow = ({ index, set, openModal, handleUpdateSet, handleRemoveSet }) => (
  <tr>
    <td>{index + 1}</td>
    <td>
      <input
        type="number"
        value={set.weight}
        onClick={() => openModal(index, "weight", set.weight)}
        readOnly
      />
    </td>
    <td>
      <input
        type="number"
        value={set.reps}
        onClick={() => openModal(index, "reps", set.reps)}
        readOnly
      />
    </td>
    <td>
      <input
        type="text"
        value={set.timer}
        onClick={() => openModal(index, "timer", set.timer)}
        readOnly
      />
    </td>
    <td>
      <button
        onClick={() => handleUpdateSet(index, "complete", !set.complete)}
        className={set.complete ? "complete-button" : "incomplete-button"}
      >
        {set.complete ? "レ" : ""}
      </button>
    </td>
    <td>
      <button
        onClick={() => handleRemoveSet(index)}
        className="delete-button"
      >
        削除
      </button>
    </td>
  </tr>
);

export default TrainingTableRow;
import React from "react";
import PropTypes from 'prop-types'; // PropTypes をインポート


const TrainingTableRowInput = ({ index, set, openModal }) => (
  <>
    <td>
      {/* 重量の入力フィールド */}
      <input
        type="number"
        value={set.weight}
        onClick={() => openModal(index, "weight", set.weight)}
        readOnly
      />
    </td>
    <td>
      {/* 回数の入力フィールド */}
      <input
        type="number"
        value={set.reps}
        onClick={() => openModal(index, "reps", set.reps)}
        readOnly
      />
    </td>
    <td>
      {/* タイマーの入力フィールド */}
      <input
        type="text"
        value={set.timer}
        onClick={() => openModal(index, "timer", set.timer)}
        readOnly
      />
    </td>
  </>
);


TrainingTableRowInput.propTypes = {
  index: PropTypes.number.isRequired,
  set: PropTypes.shape({
    weight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    reps: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    timer: PropTypes.string
  }).isRequired,
  openModal: PropTypes.func.isRequired
};

export default TrainingTableRowInput;
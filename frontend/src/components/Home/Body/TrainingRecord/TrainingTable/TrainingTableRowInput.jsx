import React from "react";


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

export default TrainingTableRowInput;
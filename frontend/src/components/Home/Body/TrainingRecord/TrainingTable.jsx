import React from "react";
import './styles/training-table.css';

const TrainingTable = ({ sets, openModal, handleUpdateSet, handleRemoveSet, handleAddSet }) => (
  <>
    <table className="training-table">
      <thead>
        <tr>
          <th>セット</th>
          <th>kg</th>
          <th>回</th>
          <th>タイマー</th>
          <th>完了</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        {sets.map((set, index) => (
          <tr key={index}>
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
        ))}
      </tbody>
    </table>
    <div className="add-set-button-container">
      <button
        onClick={handleAddSet}
        className="add-set-button"
      >
        + セット追加
      </button>
    </div>
  </>
);

export default TrainingTable;
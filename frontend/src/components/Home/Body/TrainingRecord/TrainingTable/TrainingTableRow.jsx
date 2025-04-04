import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import TimerButton from '../TimerButton/TimerButton';
import './styles/training-table-row-input.css';

const TrainingTableRow = ({ index, set, openModal, handleUpdateSet, handleRemoveSet, isAerobic }) => {
  return (
    <tr>
      <td>{index + 1}</td>
      {/* 有酸素運動の場合は分、それ以外は重量の入力フィールド */}
      <td>
        <input
          type="number"
          value={isAerobic ? (set.minutes || "") : (set.weight || "")}
          onClick={() => openModal(index, isAerobic ? "minutes" : "weight", isAerobic ? set.minutes : set.weight)}
          readOnly
        />
      </td>
      {/* 有酸素運動の場合は空白、それ以外は回数の入力フィールド */}
      <td>
        {!isAerobic && (
          <input
            type="number"
            value={set.reps || ""}
            onClick={() => openModal(index, "reps", set.reps)}
            readOnly
          />
        )}
      </td>
      {/* タイマーの入力フィールド */}
      <td>
        <input
          type="text"
          value={set.timer || ""}
          onClick={() => openModal(index, "timer", set.timer)}
          readOnly
        />
      </td>
      {/* 完了ボタン */}
      <td className="completion-cell">
        <TimerButton index={index} set={set} handleUpdateSet={handleUpdateSet} />
      </td>
      <td className="operation-cell">
        <button
          onClick={() => handleRemoveSet(index)}
          className="training-delete-button"
          aria-label="削除"
        >
          <FaTrashAlt />
        </button>
      </td>
    </tr>
  );
};

export default TrainingTableRow;
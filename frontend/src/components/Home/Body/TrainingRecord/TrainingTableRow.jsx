// このコードは、トレーニング記録の各行を表示するためのコンポーネントです。
// 各行には、重量、回数、タイマー、完了ボタン、削除ボタンが含まれています。

import React from "react";
import TimerButton from './TimerButton';
import './styles/training-table-row-input.css';
import './styles/training-table-row-button.css';

const TrainingTableRow = ({ index, set, openModal, handleUpdateSet, handleRemoveSet }) => {
  return (
    <tr>
      <td>{index + 1}</td>
      {/* 重量の入力フィールド */}
      <td>
        <input
          type="number"
          value={set.weight}
          onClick={() => openModal(index, "weight", set.weight)}
          readOnly
        />
      </td>
      {/* 回数の入力フィールド */}
      <td>
        <input
          type="number"
          value={set.reps}
          onClick={() => openModal(index, "reps", set.reps)}
          readOnly
        />
      </td>
      {/* タイマーの入力フィールド */}
      <td>
        <input
          type="text"
          value={set.timer}
          onClick={() => openModal(index, "timer", set.timer)}
          readOnly
        />
      </td>
      {/* 完了ボタン */}
      <td>
        <TimerButton index={index} set={set} handleUpdateSet={handleUpdateSet} />
      </td>
      {/* 削除ボタン */}
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
};

export default TrainingTableRow;
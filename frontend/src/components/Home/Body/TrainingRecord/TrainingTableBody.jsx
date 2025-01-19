// このコードは、トレーニング記録のテーブルボディを表示するためのコンポーネントです。
// 各セットの情報を行として表示し、セットの更新や削除が可能です。

import React from "react";
import TrainingTableRow from './TrainingTableRow';
import './styles/training-table-body.css';

const TrainingTableBody = ({ sets, openModal, handleUpdateSet, handleRemoveSet }) => (
  <tbody>
    {/* 各セットの情報を行として表示 */}
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
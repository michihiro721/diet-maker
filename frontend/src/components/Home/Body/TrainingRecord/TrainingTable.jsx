// このコードは、トレーニング記録のテーブルを表示するためのコンポーネントです。
// テーブルには、トレーニングのセット情報が含まれ、セットの追加、更新、削除が可能です。

import React from "react";
import TrainingTableHeader from './TrainingTableHeader';
import TrainingTableBody from './TrainingTableBody';
import AddSetButton from './AddSetButton';
import './styles/training-table.css';

const TrainingTable = ({ sets, openModal, handleUpdateSet, handleRemoveSet, handleAddSet }) => (
  <>
    <table className="training-table">
      {/* テーブルのヘッダーを表示 */}
      <TrainingTableHeader />
      {/* テーブルのボディを表示 */}
      <TrainingTableBody
        sets={sets}
        openModal={openModal}
        handleUpdateSet={handleUpdateSet}
        handleRemoveSet={handleRemoveSet}
      />
    </table>
    {/* セット追加ボタンを表示 */}
    <AddSetButton handleAddSet={handleAddSet} />
  </>
);

export default TrainingTable;
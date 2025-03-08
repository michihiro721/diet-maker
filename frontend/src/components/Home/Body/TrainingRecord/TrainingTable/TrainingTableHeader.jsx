// このコードは、トレーニング記録のテーブルヘッダーを表示するためのコンポーネントです。
// テーブルヘッダーには、セット番号、重量または分、回数または空白、タイマー、完了状態、操作の列が含まれます。

import React from "react";
import './styles/training-table-header.css';

const TrainingTableHeader = ({ isAerobic }) => (
  <thead>
    <tr>
      <th>セット</th>
      {isAerobic ? <th>分</th> : <th>kg</th>}
      {isAerobic ? <th></th> : <th>回</th>}
      <th>タイマー</th>
      <th>完了</th>
      <th>操作</th>
    </tr>
  </thead>
);

export default TrainingTableHeader;
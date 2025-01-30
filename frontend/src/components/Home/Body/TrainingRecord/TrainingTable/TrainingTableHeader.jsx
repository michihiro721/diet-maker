// このコードは、トレーニング記録のテーブルヘッダーを表示するためのコンポーネントです。
// テーブルヘッダーには、セット番号、重量、回数、タイマー、完了状態、操作の列が含まれます。

import React from "react";
import './styles/training-table-header.css';

const TrainingTableHeader = () => (
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
);

export default TrainingTableHeader;
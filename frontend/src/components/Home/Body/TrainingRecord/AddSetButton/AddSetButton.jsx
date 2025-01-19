// このコードは、トレーニング記録に新しいセットを追加するためのボタンコンポーネントです。
// ユーザーがボタンをクリックすると、新しいセットが追加されます。

import React from "react";
import './styles/add-set-button.css';

// AddSetButtonコンポーネントは、セット追加ボタンを表示します。
// handleAddSetプロパティは、ボタンがクリックされたときに呼び出される関数です。
const AddSetButton = ({ handleAddSet }) => (
  <div className="add-set-button-container">
    {/* ボタンがクリックされたときにhandleAddSet関数を呼び出します */}
    <button
      onClick={handleAddSet}
      className="add-set-button"
    >
      + セット追加
    </button>
  </div>
);

export default AddSetButton;
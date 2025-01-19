// このコードは、トレーニング記録の入力を補助するためのタイマーオプションコンポーネントです。
// ユーザーがタイマーのプリセット時間を選択できるようにします。

import React from "react";
import './styles/timer.css';

const TimerOptions = ({ handleTimerSelect }) => (
  <div className="timer-options">
    {/* プリセットのタイマー時間をボタンとして表示します */}
    {["00:30", "01:30", "02:00", "03:00", "04:00", "05:00"].map((time) => (
      <button
        key={time}
        className="timer-button"
        onClick={() => handleTimerSelect(time)}
      >
        {time}
      </button>
    ))}
  </div>
);

export default TimerOptions;
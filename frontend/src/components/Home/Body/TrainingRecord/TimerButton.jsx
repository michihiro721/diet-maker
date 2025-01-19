// このコードは、トレーニング記録の各行に表示されるタイマーボタンを管理するためのコンポーネントです。
// タイマーボタンは、完了ボタンとして機能し、クリックするとタイマーが開始またはリセットされます。

import React, { useState } from "react";
import AlertFunction from './AlertFunction';
import './styles/training-table-row-button.css';

const TimerButton = ({ index, set, handleUpdateSet }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);

  // 完了ボタンがクリックされたときの処理
  const handleCompleteClick = () => {
    if (set.complete) {
      // タイマーをリセットする
      setResetTimer(true);
      setShowAlert(false);
    } else {
      // タイマーを開始する
      setShowAlert(true);
      setResetTimer(false);
    }
    // セットの完了状態を更新する
    handleUpdateSet(index, "complete", !set.complete);
  };

  // タイマーが完了したときの処理
  const handleAlertComplete = () => {
    setShowAlert(false);
  };

  // タイマーの値を更新する関数
  const updateTimer = (newTime) => {
    const minutes = Math.floor(newTime / 60);
    const seconds = newTime % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    handleUpdateSet(index, "timer", formattedTime);
  };

  return (
    <>
      <button
        onClick={handleCompleteClick}
        className={set.complete ? "complete-button" : "incomplete-button"}
      >
        {set.complete ? "レ" : ""}
      </button>
      {showAlert && (
        <AlertFunction
          timer={parseInt(set.timer.split(':').reduce((acc, time) => (60 * acc) + +time))}
          onComplete={handleAlertComplete}
          updateTimer={updateTimer}
          reset={resetTimer}
        />
      )}
    </>
  );
};

export default TimerButton;
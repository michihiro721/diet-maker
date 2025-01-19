// このコードは、トレーニング記録のタイマー機能を提供するためのコンポーネントです。
// タイマーがカウントダウンし、0になったときに音声を再生し、タイマーが完了したことを通知します。
// CSSはfrontend/src/components/Home/Body/TrainingRecord/TrainingTable/styles/training-table-row-input.cssファイルを参照されて、frontend/src/components/Home/Body/TrainingRecord/TrainingTable/TrainingTableRow.jsxファイルと一緒

import React, { useState, useEffect } from 'react';

const AlertFunction = ({ timer, onComplete, updateTimer, reset }) => {
  const [timeLeft, setTimeLeft] = useState(timer); // タイマーの残り時間を管理する状態
  const [hasCompleted, setHasCompleted] = useState(false); // タイマーが完了したかどうかを管理する状態
  const originalTime = timer; // 元のタイマーの値を保持

  useEffect(() => { // タイマーの処理を行う副作用フック
    if (reset) {
      // タイマーをリセットする処理
      setTimeLeft(originalTime);
      updateTimer(originalTime);
      setHasCompleted(false);
      return;
    }

    if (timeLeft > 0 && !hasCompleted) { // タイマーが0より大きく、かつタイマーが完了していないときの処理
      // タイマーをカウントダウンする
      const timerId = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1;
          updateTimer(newTime);
          return newTime;
        });
      }, 1000); // 1秒ごとにカウントダウンする

      return () => clearInterval(timerId); // クリーンアップ関数でタイマーをクリア
    } else if (timeLeft === 0 && !hasCompleted) {
      // タイマーが0になったときの処理
      const audio = new Audio('/notification-sound.mp3'); // 音声ファイルを読み込む
      audio.play(); // 音声を再生する
      onComplete(); // タイマー完了時のコールバックを呼び出す
      setHasCompleted(true); // タイマーが完了したことを状態に設定
    }
  }, [timeLeft, onComplete, updateTimer, originalTime, reset, hasCompleted]); // 依存配列により副作用を制御

  return null; // このコンポーネントはUIを持たない
};

export default AlertFunction;
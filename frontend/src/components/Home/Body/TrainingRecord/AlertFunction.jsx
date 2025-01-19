import React, { useState, useEffect } from 'react';

const AlertFunction = ({ timer, onComplete, updateTimer, reset }) => {
  const [timeLeft, setTimeLeft] = useState(timer); // タイマーの残り時間
  const [hasCompleted, setHasCompleted] = useState(false); // タイマーが完了したかどうか
  const originalTime = timer; // 元のタイマーの値を保持

  useEffect(() => { // タイマーの処理
    if (reset) {
      // タイマーをリセットする
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

      return () => clearInterval(timerId);
    } else if (timeLeft === 0 && !hasCompleted) {
      // タイマーが0になったときの処理
      const audio = new Audio('/notification-sound.mp3'); // 音声ファイルを読み込む
      audio.play(); // 音声を再生する
      onComplete();
      setHasCompleted(true);
    }
  }, [timeLeft, onComplete, updateTimer, originalTime, reset, hasCompleted]);

  return null;
};

export default AlertFunction;
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

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
  }, [timeLeft, onComplete, updateTimer, originalTime, reset, hasCompleted]);

  return null;
};


AlertFunction.propTypes = {
  timer: PropTypes.number.isRequired,
  onComplete: PropTypes.func.isRequired,
  updateTimer: PropTypes.func.isRequired,
  reset: PropTypes.bool
};

export default AlertFunction;
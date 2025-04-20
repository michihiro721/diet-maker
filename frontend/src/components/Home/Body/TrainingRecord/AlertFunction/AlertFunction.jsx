import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AlertFunction = ({ timer, onComplete, updateTimer, reset }) => {
  const [timeLeft, setTimeLeft] = useState(timer);
  const [hasCompleted, setHasCompleted] = useState(false);
  const originalTime = timer;

  useEffect(() => {
    if (reset) {
      setTimeLeft(originalTime);
      updateTimer(originalTime);
      setHasCompleted(false);
      return;
    }

    if (timeLeft > 0 && !hasCompleted) {
      const timerId = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1;
          updateTimer(newTime);
          return newTime;
        });
      }, 1000); // 1秒ごとにカウントダウン

      return () => clearInterval(timerId);
    } else if (timeLeft === 0 && !hasCompleted) {
      const audio = new Audio('/notification-sound.mp3'); // 音声ファイルを読み込む
      audio.play();
      onComplete();
      setHasCompleted(true);
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
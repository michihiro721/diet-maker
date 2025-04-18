import React, { useState } from "react";
import PropTypes from 'prop-types';
import axios from "axios";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CalenderFormatShortWeekday, CalenderTileClassName, CalenderTileContent } from "../Home/Body/Calender/Calender";
import "./styles/TrainingCopyModal.css";

const api = axios.create({
  baseURL: "https://diet-maker-d07eb3099e56.herokuapp.com"
});

const TrainingCopyModal = ({ isOpen, onClose, trainingData }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleCopyTrainings = async () => {
    const parseJwt = (token) => {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
      } catch(e) {
        return null;
      }
    };

    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      setErrorMessage("認証情報が見つかりません。再ログインしてください。");
      return;
    }

    const decodedToken = parseJwt(jwt);
    const loggedInUserId = decodedToken && decodedToken.sub ? decodedToken.sub : null;

    if (!loggedInUserId) {
      setErrorMessage("ユーザーIDが見つかりません。ログインしてください。");
      return;
    }

    if (trainingData.length === 0) {
      setErrorMessage("コピーするトレーニングデータがありません。");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const config = {
        headers: { 'Authorization': `Bearer ${jwt}` }
      };

      const trainingsArray = trainingData.map(training => {
        return {
          user_id: loggedInUserId,
          workout_id: training.workout_id,
          date: formattedDate,
          sets: training.sets,
          weight: training.weight,
          reps: training.reps || 0
        };
      });

      const response = await api.post('/trainings', { training: trainingsArray }, config);

      setSuccessMessage(`${formattedDate}にトレーニングメニューを保存しました`);
      setIsSaving(false);

      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (error) {
      setErrorMessage(`エラー: ${error.response?.data?.error || error.message}`);
      setIsSaving(false);
    }
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return '';

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();

    return `${year}年${month}月${day}日`;
  };

  return (
    <div className="training-copy-modal-overlay" onClick={onClose}>
      <div className="training-copy-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="training-copy-modal-title">トレーニングメニューをコピー</h3>

        <div className="training-copy-modal-content">
          <div className="training-copy-modal-calendar-container">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              formatShortWeekday={CalenderFormatShortWeekday}
              tileClassName={CalenderTileClassName}
              tileContent={CalenderTileContent}
            />
          </div>

          <div className="training-copy-modal-selected-date">
            選択した日付: {formatSelectedDate()}
          </div>

          {errorMessage && (
            <div className="training-copy-modal-error">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="training-copy-modal-success">
              {successMessage}
            </div>
          )}

          <div className="training-copy-modal-buttons">
            <button
              className="training-copy-modal-cancel-button"
              onClick={onClose}
              disabled={isSaving}
            >
              キャンセル
            </button>
            <button
              className="training-copy-modal-save-button"
              onClick={handleCopyTrainings}
              disabled={isSaving}
            >
              {isSaving ? "保存中..." : "保存"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

TrainingCopyModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  trainingData: PropTypes.arrayOf(
    PropTypes.shape({
      workout_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      sets: PropTypes.oneOfType([PropTypes.array, PropTypes.number, PropTypes.string]),
      weight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      reps: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    })
  ).isRequired
};

export default TrainingCopyModal;
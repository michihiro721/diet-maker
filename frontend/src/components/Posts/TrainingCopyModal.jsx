// frontend/src/components/Posts/TrainingCopyModal.jsx
import React, { useState } from "react";
import axios from "axios";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../Home/Body/Calender/styles/CalenderWeekdays.css';
import '../Home/Body/Calender/styles/CalenderNavigation.css';
import '../Home/Body/Calender/styles/CalenderDays.css';
import '../Home/Body/Calender/styles/CalenderCommon.css';
import CalenderFormatShortWeekday from "../Home/Body/Calender/CalenderFormatShortWeekday";
import CalenderTileClassName from "../Home/Body/Calender/CalenderTileClassName";
import CalenderTileContent from "../Home/Body/Calender/CalenderTileContent";
import "./styles/TrainingCopyModal.css";

const api = axios.create({
  baseURL: "https://diet-maker-d07eb3099e56.herokuapp.com"
});

const TrainingCopyModal = ({ isOpen, onClose, trainingData, userId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleCopyTrainings = async () => {
    if (!userId) {
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
  
      // 日付をYYYY-MM-DD形式に変換（タイムゾーンを考慮）
      // 選択した日付のローカル時間（年月日）を保持する
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
  
      // トークンを取得
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        setErrorMessage("認証情報が見つかりません。再ログインしてください。");
        setIsSaving(false);
        return;
      }
  
      const config = {
        headers: { 'Authorization': `Bearer ${jwt}` }
      };
  
      // 全てのトレーニングデータを配列にまとめる
      const trainingsArray = trainingData.map(training => {
        return {
          user_id: userId,
          workout_id: training.workout_id,
          date: formattedDate,
          sets: training.sets,
          weight: training.weight,
          reps: training.reps || 0 // 有酸素運動の場合はrepsがない可能性があるため
        };
      });
  
      // バックエンドが期待する形式で送信
      await api.post('/trainings', { training: trainingsArray }, config);
      
      setSuccessMessage(`${formattedDate}にトレーニングメニューを保存しました`);
      setIsSaving(false);
      
      // 3秒後にモーダルを閉じる
      setTimeout(() => {
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error("トレーニングのコピーに失敗しました:", error);
      setErrorMessage(`エラー: ${error.response?.data?.error || error.message}`);
      setIsSaving(false);
    }
  };

  // 選択した日付を日本語形式で表示
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
          <p className="training-copy-modal-info">
            トレーニングメニューをコピーする日付を選択してください。
          </p>
          
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

export default TrainingCopyModal;
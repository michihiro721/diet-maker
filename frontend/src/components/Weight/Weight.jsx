import React, { useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import '../Home/Body/Calender/styles/CalenderCommon.css';
import '../Home/Body/Calender/styles/CalenderNavigation.css';
import '../Home/Body/Calender/styles/CalenderWeekdays.css';
import '../Home/Body/Calender/styles/CalenderDays.css';
import CalenderTileClassName from '../Home/Body/Calender/CalenderTileClassName';
import CalenderFormatShortWeekday from '../Home/Body/Calender/CalenderFormatShortWeekday';
import CalenderTileContent from '../Home/Body/Calender/CalenderTileContent';
import './styles/Weight.css';
import WeightModal from './WeightModal';

const Weight = () => {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [weight, setWeight] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalData, setGoalData] = useState(null);

  const onChange = (newDate) => {
    setDate(newDate);
  };

  const handleClick = () => {
    setSelectedDate(date);
  };

  const handleSave = async (value) => {
    setWeight(value);
    setIsModalOpen(false);

    // 体重データを保存する
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/weights`, {
        weight: {
          user_id: 1, // ユーザーIDを適切に設定する
          date: selectedDate,
          weight: value,
        }
      });
      console.log('Weight data saved:', response.data);
    } catch (error) {
      console.error('Error saving weight data:', error);
    }

    // 最新の目標データを再取得する
    try {
      console.log('Fetching latest goal data after save...');
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/goals/latest`); // 最新の目標データを取得するエンドポイント
      console.log('Goal data fetched after save:', response.data);
      setGoalData(response.data);
    } catch (error) {
      console.error('Error fetching goal data after save:', error);
    }
  };

  const handleSubmit = async () => {
    // 体重データを保存する
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/weights`, {
        weight: {
          user_id: 1, // ユーザーIDを適切に設定する
          date: selectedDate,
          weight: weight,
        }
      });
      console.log('Weight data saved:', response.data);
    } catch (error) {
      console.error('Error saving weight data:', error);
    }
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short' };
    return date.toLocaleDateString('ja-JP', options);
  };

  const calculateRemainingDays = (endDate) => {
    const today = new Date();
    const targetDate = new Date(endDate);
    const timeDiff = targetDate - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
  };

  return (
    <div>
      <div>
        <Calendar
          onChange={onChange}
          value={date}
          tileClassName={CalenderTileClassName}
          formatShortWeekday={CalenderFormatShortWeekday}
          tileContent={CalenderTileContent}
        />
      </div>
      <div>
        <button className="weight-date-select-button" onClick={handleClick}>日付を選択</button>
      </div>
      {selectedDate && (
        <div className="weight-selected-date">
          <h2>日付: {formatDate(selectedDate)}</h2>
        </div>
      )}
      {selectedDate && (
        <div className="weight-input-container">
          <button className="weight-input-button" onClick={() => setIsModalOpen(true)}>体重を入力</button>
        </div>
      )}
      {weight && (
        <div className="weight-display">
          <h2>現在の体重: {weight} kg</h2>
        </div>
      )}
      {goalData && (
        <div className="goal-data-display">
          <h2 className="weight-goal-weight">目標体重: {goalData.target_weight} kg</h2>
          <h2 className="weight-remaining-days">目標達成予定日までの残り日数: {calculateRemainingDays(goalData.end_date)} 日</h2>
        </div>
      )}
      <WeightModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
      <div className="weight-submit-container">
        <button className="weight-save-button" onClick={handleSubmit}>保存</button>
      </div>
    </div>
  );
};

export default Weight;
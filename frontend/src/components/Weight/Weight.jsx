import React, { useState } from "react";
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

  const onChange = (newDate) => {
    setDate(newDate);
  };

  const handleClick = () => {
    setSelectedDate(date);
  };

  const handleWeightChange = (value) => {
    setWeight(value);
  };

  const handleSave = (value) => {
    setWeight(value);
    setIsModalOpen(false);
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short' };
    return date.toLocaleDateString('ja-JP', options);
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
      <WeightModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default Weight;
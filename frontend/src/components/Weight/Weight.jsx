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

const Weight = () => {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [weight, setWeight] = useState("");

  const onChange = (newDate) => {
    setDate(newDate);
  };

  const handleClick = () => {
    setSelectedDate(date);
  };

  const handleWeightChange = (e) => {
    setWeight(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // ここで体重を保存する処理を実装
    console.log(`Date: ${selectedDate}, Weight: ${weight}`);
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
          <form onSubmit={handleSubmit}>
            <input
              type="number"
              className="weight-input"
              placeholder="体重を入力"
              value={weight}
              onChange={handleWeightChange}
            />
            <button type="submit" className="weight-submit-button">保存</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Weight;
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

  const onChange = (newDate) => {
    setDate(newDate);
  };

  const handleClick = () => {
    setSelectedDate(date);
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
          <h2>{formatDate(selectedDate)}</h2>
        </div>
      )}
    </div>
  );
};

export default Weight;
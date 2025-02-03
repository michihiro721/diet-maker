import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './styles/CalenderCommon.css';
import './styles/CalenderNavigation.css';
import './styles/CalenderWeekdays.css';
import './styles/CalenderDays.css';
import CalenderTileClassName from './CalenderTileClassName';
import CalenderFormatShortWeekday from './CalenderFormatShortWeekday';
import CalenderTileContent from './CalenderTileContent';

function Calender({ onDateSelect }) {
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };

  const handleDateSelect = () => {
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  return (
    <div>
      <Calendar
        onChange={onChange}
        value={date}
        tileClassName={CalenderTileClassName}
        formatShortWeekday={CalenderFormatShortWeekday}
        tileContent={CalenderTileContent}
      />
      <button className="date-select-button" onClick={handleDateSelect}>日付を選択</button>
    </div>
  );
}

export default Calender;
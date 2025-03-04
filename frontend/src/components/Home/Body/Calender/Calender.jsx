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
    if (onDateSelect) {
      onDateSelect(newDate);
    }
  };

  // カレンダーを非表示にするためにnullを返す
  return null;
}

export default Calender;
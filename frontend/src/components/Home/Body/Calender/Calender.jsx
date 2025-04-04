import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './styles/CalenderCommon.css';
import './styles/CalenderNavigation.css';
import './styles/CalenderWeekdays.css';
import './styles/CalenderDays.css';

// カレンダーの曜日の表示をカスタマイズするための関数
export const CalenderFormatShortWeekday = (locale, date) => {
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  return weekdays[date.getDay()];
};

// カレンダーのタイルにカスタムクラス名を付けるための関数
export const CalenderTileClassName = ({ date, view }) => {
  if (view === 'month') {
    const day = date.getDay();
    if (day === 0) {
      return 'react-calendar__tile--sunday';
    } else if (day === 6) {
      return 'react-calendar__tile--saturday';
    }
  }
  return null;
};

// カレンダーの日付の表示をカスタマイズするための関数
export const CalenderTileContent = ({ date, view }) => {
  if (view === 'month') {
    return <span>{date.getDate()}</span>;
  }
  return null;
};

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
import React from 'react';
import 'react-calendar/dist/Calendar.css';
import './styles/Calendar.css';
import PropTypes from 'prop-types';

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

function Calender() {
  // カレンダーを非表示にするためにnullを返す
  return null;
}

CalenderTileClassName.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  view: PropTypes.string.isRequired
};

CalenderTileContent.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  view: PropTypes.string.isRequired
};

Calender.propTypes = {};

export default Calender;
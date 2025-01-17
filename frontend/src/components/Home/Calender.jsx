import React, { useState } from 'react'; // reactとuseStateをインポート
import Calendar from 'react-calendar'; // react-calendarをインポート
import 'react-calendar/dist/Calendar.css'; // カレンダーのCSSファイルをインポート
import './Calender.css'; // カスタムCSSファイルをインポート

function Calender() {
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div>
      <Calendar
        onChange={onChange}
        value={date}
      />
    </div>
  );
}

export default Calender;
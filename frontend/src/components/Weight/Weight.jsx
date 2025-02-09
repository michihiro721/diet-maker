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

const Weight = () => {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const onChange = (newDate) => {
    setDate(newDate);
  };

  const handleClick = () => {
    setSelectedDate(date);
  };

  return (
    <div>
      <div>
{/* カレンダーの「日」を削除して数字だけを表示 */}
        <Calendar
          onChange={onChange}
          value={date}
          tileClassName={CalenderTileClassName}
          formatShortWeekday={CalenderFormatShortWeekday}
          tileContent={CalenderTileContent}
        />
      </div>
      <div>
        <button onClick={handleClick}>日付を選択</button>
      </div>
      {selectedDate && (
        <div>
          <h2>選択した日付: {selectedDate.toDateString()}</h2>
        </div>
      )}
    </div>
  );
};

export default Weight;
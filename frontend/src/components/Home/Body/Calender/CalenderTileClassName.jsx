// このコードは、カレンダーのタイルにカスタムクラス名を付けるための関数です。

const CalenderTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const day = date.getDay();
      if (day === 0) {
        return 'react-calendar__tile--sunday';
      } else if (day === 1) {
        return 'react-calendar__tile--saturday';
      }
    }
    return null;
  };
  
  export default CalenderTileClassName;
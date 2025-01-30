// このコードは、カレンダーの日付の表示をカスタマイズするための関数です。

const CalenderTileContent = ({ date, view }) => {
    if (view === 'month') {
      return <span>{date.getDate()}</span>;
    }
    return null;
  };
  
  export default CalenderTileContent;
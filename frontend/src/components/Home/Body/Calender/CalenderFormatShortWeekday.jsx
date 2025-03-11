// このコードは、カレンダーの曜日の表示をカスタマイズするための関数です。

const CalenderFormatShortWeekday = (locale, date) => {
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  return weekdays[date.getDay()];
};

export default CalenderFormatShortWeekday;
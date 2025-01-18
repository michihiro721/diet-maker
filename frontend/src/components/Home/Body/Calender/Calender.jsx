import React, { useState } from 'react'; // ReactとuseStateフックをインポート
import Calendar from 'react-calendar'; // react-calendarコンポーネントをインポート
import 'react-calendar/dist/Calendar.css'; // カレンダーのデフォルトCSSファイルをインポート
import './Calender.css'; // カスタムCSSファイルをインポート

function Calender() {
  // 日付の状態を管理するためのuseStateフックを使用
  const [date, setDate] = useState(new Date());

  // カレンダーの日付が変更されたときに呼び出される関数
  const onChange = (newDate) => {
    setDate(newDate); // 状態を新しい日付に更新
  };

  // カスタムレンダリング関数
  const tileClassName = ({ date, view }) => {
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

  // 曜日の表示をカスタマイズ
  const formatShortWeekday = (locale, date) => {
    const weekdays = ['土', '日', '月', '火', '水', '木', '金'];
    return weekdays[date.getDay()];
  };

  return (
    <div>
      {/* カレンダーコンポーネントを表示し、onChangeとvalueプロパティを設定 */}
      <Calendar
        onChange={onChange}
        value={date}
        tileClassName={tileClassName}
        formatShortWeekday={formatShortWeekday}
      />
    </div>
  );
}

export default Calender; // Calenderコンポーネントをエクスポート
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

  return (
    <div>
      {/* カレンダーコンポーネントを表示し、onChangeとvalueプロパティを設定 */}
      <Calendar
        onChange={onChange}
        value={date}
      />
    </div>
  );
}

export default Calender; // Calenderコンポーネントをエクスポート
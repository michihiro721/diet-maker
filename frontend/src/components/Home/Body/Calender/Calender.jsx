// このコードは、カレンダーを表示し、ユーザーが日付を選択できるようにするためのコンポーネントです。
// カレンダーの日付が変更されたときに状態を更新し、カスタムスタイルやカスタム表示を提供します。

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
        tileClassName={CalenderTileClassName}
        formatShortWeekday={CalenderFormatShortWeekday}
        tileContent={CalenderTileContent}
      />
    </div>
  );
}

export default Calender; // Calenderコンポーネントをエクスポート
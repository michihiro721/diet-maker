import React, { useState } from "react";
import axios from "axios";
import { getTrainingMenu1 } from "./GetTrainingMenuMen1";
import { getTrainingMenu2 } from "./GetTrainingMenuMen2";
import { getTrainingMenu3 } from "./GetTrainingMenuMen3";
import { getTrainingMenu4 } from "./GetTrainingMenuMen4";
import { getTrainingMenu5 } from "./GetTrainingMenuMen5";
import { getTrainingMenu6 } from "./GetTrainingMenuMen6";
import { getTrainingMenu1Woman } from "./GetTrainingMenuWoman1";
import { getTrainingMenu2Woman } from "./GetTrainingMenuWoman2";
import { getTrainingMenu3Woman } from "./GetTrainingMenuWoman3";
import { getTrainingMenu4Woman } from "./GetTrainingMenuWoman4";
import { getTrainingMenu5Woman } from "./GetTrainingMenuWoman5";
import { getTrainingMenu6Woman } from "./GetTrainingMenuWoman6";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './styles/TrainingMenu.css';
import '../Home/Body/Calender/styles/CalenderWeekdays.css';
import '../Home/Body/Calender/styles/CalenderNavigation.css';
import '../Home/Body/Calender/styles/CalenderDays.css';
import '../Home/Body/Calender/styles/CalenderCommon.css';
import CalenderFormatShortWeekday from "../Home/Body/Calender/CalenderFormatShortWeekday";
import CalenderTileClassName from "../Home/Body/Calender/CalenderTileClassName";
import CalenderTileContent from "../Home/Body/Calender/CalenderTileContent";

const TrainingMenu = () => {
  const [gender, setGender] = useState("");
  const [gymType, setGymType] = useState("");
  const [frequency, setFrequency] = useState("");
  const [volume, setVolume] = useState("");
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedDates, setSelectedDates] = useState({});
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [currentDayMenuIndex, setCurrentDayMenuIndex] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentDayMenu, setCurrentDayMenu] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!gender || !gymType || !frequency || !volume) {
      setError("全ての項目を入力してください");
      return;
    }
    setError("");

    let generatedMenu;
    if (gender === "男性") {
      if (gymType === "ジムに通っている") {
        generatedMenu = getTrainingMenu1(gender, gymType, frequency, volume);
      } else if (gymType === "ホームジム1") {
        generatedMenu = getTrainingMenu2(gender, gymType, frequency, volume);
      } else if (gymType === "ホームジム2") {
        generatedMenu = getTrainingMenu3(gender, gymType, frequency, volume);
      } else if (gymType === "ホームジム3") {
        generatedMenu = getTrainingMenu4(gender, gymType, frequency, volume);
      } else if (gymType === "ホームジム4") {
        generatedMenu = getTrainingMenu5(gender, gymType, frequency, volume);
      } else if (gymType === "自重のみ") {
        generatedMenu = getTrainingMenu6(gender, gymType, frequency, volume);
      }
    } else if (gender === "女性") {
      if (gymType === "ジムに通っている") {
        generatedMenu = getTrainingMenu1Woman(gender, gymType, frequency, volume);
      } else if (gymType === "ホームジム1") {
        generatedMenu = getTrainingMenu2Woman(gender, gymType, frequency, volume);
      } else if (gymType === "ホームジム2") {
        generatedMenu = getTrainingMenu3Woman(gender, gymType, frequency, volume);
      } else if (gymType === "ホームジム3") {
        generatedMenu = getTrainingMenu4Woman(gender, gymType, frequency, volume);
      } else if (gymType === "ホームジム4") {
        generatedMenu = getTrainingMenu5Woman(gender, gymType, frequency, volume);
      } else if (gymType === "自重のみ") {
        generatedMenu = getTrainingMenu6Woman(gender, gymType, frequency, volume);
      }
    }
    setMenu(generatedMenu);
  };

  const handleSaveMenu = async () => {
    try {
      // ローカルストレージからユーザーIDを取得
      const userId = localStorage.getItem('userid') || 1;
      const trainingData = [];
      const selectedDate = selectedDates[currentDayMenuIndex];

      // 各エクササイズをtrainingDataに追加
      currentDayMenu.items.forEach((item) => {
        item.exercises.forEach((exercise) => {
          for (let setIndex = 0; setIndex < exercise.sets; setIndex++) {
            trainingData.push({
              user_id: userId,
              date: selectedDate,
              goal_id: 1,
              workout_id: exercise.workout_id,
              sets: setIndex + 1,
              reps: exercise.reps,
              weight: exercise.weight,
            });
          }
        });
      });

      // デバッグのために送信するデータをコンソールに出力
      console.log("Sending training data:", trainingData);

      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/trainings`, {
        training: trainingData,
      });

      if (response.status === 201) {
        alert("トレーニングメニューが保存されました");
      } else {
        alert("トレーニングメニューの保存に失敗しました");
      }
    } catch (error) {
      console.error("Error saving training menu:", error);
      alert("トレーニングメニューの保存に失敗しました");
    } finally {
      setIsConfirmModalOpen(false);
    }
  };

  const handleDateChange = (date) => {
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    setSelectedDates((prevDates) => ({
      ...prevDates,
      [currentDayMenuIndex]: offsetDate.toISOString().split('T')[0],
    }));
    setIsCalendarModalOpen(false);
  };

  const openConfirmModal = (dayMenu, index) => {
    setCurrentDayMenu(dayMenu);
    setCurrentDayMenuIndex(index);
    setIsConfirmModalOpen(true);
  };

  return (
    <div className="training-menu-container">
      <form onSubmit={handleSubmit}>
        <div className="training-menu-form-group">
          <label>性別</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">選択してください</option>
            <option value="男性">男性</option>
            <option value="女性">女性</option>
          </select>
        </div>
        <div className="training-menu-form-group">
          <label>ジムタイプ</label>
          <select value={gymType} onChange={(e) => setGymType(e.target.value)}>
            <option value="">選択してください</option>
            <option value="ジムに通っている">ジムに通っている</option>
            <option value="ホームジム1">ホームジム1（バーベル、ダンベル、ベンチ、チンニング）</option>
            <option value="ホームジム2">ホームジム2（ダンベルとベンチ）</option>
            <option value="ホームジム3">ホームジム3（チンニング）</option>
            <option value="ホームジム4">ホームジム4（ダンベル、ベンチ、チンニング）</option>
            <option value="自重のみ">自重のみでやりたい！</option>
          </select>
        </div>
        <div className="training-menu-form-group">
          <label>トレーニング頻度</label>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
            <option value="">選択してください</option>
            <option value="6回/週">6回/週</option>
            <option value="5回/週">5回/週</option>
            <option value="4回/週">4回/週</option>
            <option value="3回/週">3回/週</option>
          </select>
        </div>
        <div className="training-menu-form-group">
          <label>トレーニングボリューム</label>
          <select value={volume} onChange={(e) => setVolume(e.target.value)}>
            <option value="">選択してください</option>
            <option value="多いのがいい！">多いのがいい！</option>
            <option value="普通がいいかな〜">普通がいいかな〜</option>
            <option value="継続が目的なので、少なめで">継続が目的なので、少なめで</option>
          </select>
        </div>
        <button type="submit" className="training-menu-submit-button">作成</button>
      </form>
      {menu && (
        <div className="training-menu-menu-result">
          <h2>トレーニングメニュー</h2>
          {menu.map((dayMenu, index) => (
            <div key={index}>
              <h3 className="training-menu-title">{dayMenu.title}</h3>
              <ul className="training-menu-list">
                {dayMenu.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="training-menu-list-item">
                    <span className="training-menu-day">{item.day}:</span>
                    <ul>
                      {item.exercises.map((exercise, exerciseIndex) => (
                        <li key={exercise.key}>{exercise.name} - {exercise.sets}セット x {exercise.reps}回</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
              <input
                type="text"
                value={selectedDates[index] || "日付を入力してください"}
                onClick={() => {
                  setCurrentDayMenuIndex(index);
                  setIsCalendarModalOpen(true);
                }}
                readOnly
                className="training-menu-date-input"
              />
              <button onClick={() => openConfirmModal(dayMenu, index)} className="training-menu-save-button">保存</button>
            </div>
          ))}
          {error && <div className="training-menu-error-message">{error}</div>}
          {successMessage && <div className="training-menu-success-message">{successMessage}</div>}
        </div>
      )}
      {isCalendarModalOpen && (
        <div className="training-menu-calendar-modal-overlay" onClick={() => setIsCalendarModalOpen(false)}>
          <div className="training-menu-calendar-modal" onClick={(e) => e.stopPropagation()}>
            <Calendar
              onChange={handleDateChange}
              formatShortWeekday={CalenderFormatShortWeekday}
              tileClassName={CalenderTileClassName}
              tileContent={CalenderTileContent}
            />
          </div>
        </div>
      )}
      {isConfirmModalOpen && (
        <div className="training-menu-confirm-modal-overlay" onClick={() => setIsConfirmModalOpen(false)}>
          <div className="training-menu-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <p>本当に保存しますか？</p>
            <button onClick={handleSaveMenu} className="training-menu-confirm-button">はい</button>
            <button onClick={() => setIsConfirmModalOpen(false)} className="training-menu-cancel-button">いいえ</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingMenu;
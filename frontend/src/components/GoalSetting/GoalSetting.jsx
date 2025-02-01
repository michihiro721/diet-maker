import React, { useState } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Header from "../Home/Header/Header"; // 代わりに共通のHeaderコンポーネントをインポート
import "./styles/GoalSetting.css";
import "../Home/Body/Calender/styles/CalenderWeekdays.css"; // カレンダーのスタイルをインポート
import "../Home/Body/Calender/styles/CalenderNavigation.css"; // カレンダーのスタイルをインポート
import "../Home/Body/Calender/styles/CalenderDays.css"; // カレンダーのスタイルをインポート
import "../Home/Body/Calender/styles/CalenderCommon.css"; // カレンダーのスタイルをインポート
import CalenderFormatShortWeekday from "../Home/Body/Calender/CalenderFormatShortWeekday";
import CalenderTileClassName from "../Home/Body/Calender/CalenderTileClassName";
import CalenderTileContent from "../Home/Body/Calender/CalenderTileContent";

const GoalSetting = () => {
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalValue, setModalValue] = useState(new Date());
  const [submittedData, setSubmittedData] = useState(null); // 提出されたデータを保存する状態
  const [submissionDate, setSubmissionDate] = useState(""); // 目標設定がされた日を保存する状態
  const [warningModalOpen, setWarningModalOpen] = useState(false); // 警告モーダルの状態
  const [inputWarning, setInputWarning] = useState(""); // 入力警告メッセージの状態

  const handleSubmit = (e) => {
    e.preventDefault();

    // 入力チェック
    if (!currentWeight || !targetWeight || !targetDate) {
      setInputWarning("全ての項目を入力してください。");
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    setSubmissionDate(today);

    // 減量幅のチェック
    const currentWeightNum = parseFloat(currentWeight);
    const targetWeightNum = parseFloat(targetWeight);
    const targetDateObj = new Date(targetDate);
    const todayObj = new Date(today);
    const daysDiff = (targetDateObj - todayObj) / (1000 * 60 * 60 * 24);
    const monthsDiff = daysDiff / 30;

    // 許容減量幅の計算
    const maxWeightLoss = currentWeightNum * 0.05 * monthsDiff;

    if (daysDiff > 0 && (currentWeightNum - targetWeightNum) > maxWeightLoss) {
      setWarningModalOpen(true);
      return;
    }

    setSubmittedData({
      currentWeight,
      targetWeight,
      targetDate,
    });
    setInputWarning(""); // 入力警告メッセージをクリア
  };

  const openModal = (type) => {
    setModalType(type);
    if (type === "targetDate") {
      setModalValue(new Date());
    } else {
      setModalValue(type === "currentWeight" ? currentWeight : targetWeight);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (modalType === "currentWeight") {
      setCurrentWeight(modalValue);
    } else if (modalType === "targetWeight") {
      setTargetWeight(modalValue);
    } else if (modalType === "targetDate") {
      setTargetDate(modalValue.toISOString().split('T')[0]);
    }
    setIsModalOpen(false);
  };

  const handleDateChange = (date) => {
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    setModalValue(offsetDate);
    setTargetDate(offsetDate.toISOString().split('T')[0]);
  };

  const handleCalculatorClick = (value) => {
    setModalValue((prev) => prev.toString() + value);
  };

  const handleBackspace = () => {
    setModalValue((prev) => prev.toString().slice(0, -1));
  };

  const handleModalSave = () => {
    closeModal();
  };

  const handleClickOutside = (e) => {
    if (e.target.className === "goal-setting-modal" || e.target.className === "goal-setting-modal-calendar") {
      closeModal();
    }
  };

  const closeWarningModal = () => {
    setWarningModalOpen(false);
  };

  return (
    <div className="goal-setting-container">
      <Header title="目標設定" />

      {inputWarning && (
        <div className="input-warning">
          {inputWarning}
        </div>
      )}

      <form className="goal-setting-form" onSubmit={handleSubmit}>
        <div className="goal-setting-field">
          <label className="goal-setting-label">現在の体重</label>
          <div className="goal-setting-input-wrapper">
            <input
              type="text"
              className="goal-setting-input"
              value={currentWeight ? `${currentWeight} kg` : ""}
              onClick={() => openModal("currentWeight")}
              readOnly
            />
          </div>
        </div>
        <div className="goal-setting-field">
          <label className="goal-setting-label">目標体重</label>
          <div className="goal-setting-input-wrapper">
            <input
              type="text"
              className="goal-setting-input"
              value={targetWeight ? `${targetWeight} kg` : ""}
              onClick={() => openModal("targetWeight")}
              readOnly
            />
          </div>
        </div>
        <div className="goal-setting-field">
          <label className="goal-setting-label">目標達成予定日</label>
          <div className="goal-setting-input-wrapper">
            <input
              type="text"
              className="goal-setting-input"
              value={targetDate}
              onClick={() => openModal("targetDate")}
              readOnly
            />
          </div>
        </div>
        <button type="submit" className="goal-setting-button">設定</button>
      </form>

      {submittedData && (
        <div className="submitted-data">
          <h2>設定目標</h2>
          <p>目標設定時の体重: {submittedData.currentWeight} kg</p>
          <p>目標体重: {submittedData.targetWeight} kg</p>
          <p>目標達成予定日: {submittedData.targetDate}</p>
          <p>目標設定日: {submissionDate}</p>
        </div>
      )}

      {isModalOpen && modalType === "targetDate" && (
        <div className="goal-setting-modal-calendar" style={{ display: 'block' }} onClick={handleClickOutside}>
          <div className="goal-setting-modal-content-calendar">
            <Calendar
              onChange={handleDateChange}
              value={modalValue}
              className="react-calendar"
              formatShortWeekday={CalenderFormatShortWeekday}
              tileClassName={CalenderTileClassName}
              tileContent={CalenderTileContent}
            />
            <button className="goal-setting-modal-button" onClick={handleModalSave}>保存</button>
          </div>
        </div>
      )}

      {isModalOpen && modalType !== "targetDate" && (
        <div className="goal-setting-modal" style={{ display: 'block' }} onClick={handleClickOutside}>
          <div className="goal-setting-modal-content">
            <input
              type="text"
              className="goal-setting-keyboard-input"
              value={modalValue}
              readOnly
            />
            <div className="goal-setting-calculator-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "."].map((num) => (
                <button key={num} onClick={() => handleCalculatorClick(num)}>{num}</button>
              ))}
              <button onClick={handleBackspace}>←</button>
            </div>
            <button className="goal-setting-modal-button" onClick={handleModalSave}>保存</button>
          </div>
        </div>
      )}

      {warningModalOpen && (
        <div className="goal-setting-warning-modal">
          <div className="goal-setting-warning-modal-content">
            <p>1ヶ月の減量幅が体重の5%を超えていて危険です！！</p>
            <p>「目標体重」もしくは「目標達成予定日」を変更してください。</p>
            <button className="goal-setting-modal-button" onClick={closeWarningModal}>閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalSetting;
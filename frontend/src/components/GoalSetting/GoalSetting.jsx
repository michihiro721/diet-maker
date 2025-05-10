import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Header from "../Home/Header/Header";
import "./styles/GoalSetting.css";
import { CalenderFormatShortWeekday, CalenderTileClassName, CalenderTileContent } from "../Home/Body/Calender/Calender";
import { useNavigate } from "react-router-dom";

const GoalSetting = () => {
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalValue, setModalValue] = useState(new Date());
  const [submittedData, setSubmittedData] = useState(null);
  const [submissionDate, setSubmissionDate] = useState("");
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [inputWarning, setInputWarning] = useState("");
  const [userId, setUserId] = useState(null);
  const [existingGoal, setExistingGoal] = useState(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const navigate = useNavigate();
  const alertShownRef = useRef(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      const parsedUserId = parseInt(storedUserId, 10);
      setUserId(parsedUserId);

      fetchUserGoal(parsedUserId);
    } else {
      if (!alertShownRef.current) {
        alertShownRef.current = true;
        alert('目標設定を行うにはログインが必要です');
        navigate('/login');
      }
    }
  }, [navigate]);

  const fetchUserGoal = async (userId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://diet-maker-d07eb3099e56.herokuapp.com';
      const response = await axios.get(`${apiUrl}/goals/latest`, {
        params: { user_id: userId }
      });

      if (response.data && Object.keys(response.data).length > 0) {
        setExistingGoal(response.data);
        if (response.data.target_weight) {
          setTargetWeight(response.data.target_weight.toString());
        }
        if (response.data.end_date) {
          setTargetDate(response.data.end_date);
        }
      }
    } catch (error) {
      console.error('目標データの取得中にエラーが発生しました:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      if (!alertShownRef.current) {
        alertShownRef.current = true;
        alert('目標設定を行うにはログインが必要です');
        navigate('/login');
      }
      return;
    }

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
    setInputWarning("");

    try {
      const goalData = {
        user_id: userId,
        goal_type: 'weight_loss',
        target_weight: targetWeightNum,
        start_date: today,
        end_date: targetDate,
      };

      let response;
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://diet-maker-d07eb3099e56.herokuapp.com';

      if (existingGoal && existingGoal.user_id === userId) {
        response = await axios.put(
          `${apiUrl}/goals/${existingGoal.id}`,
          { goal: goalData },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
      } else {
        response = await axios.post(
          `${apiUrl}/goals`,
          { goal: goalData },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
      }

      if (response.status >= 200 && response.status < 300) {
        fetchUserGoal(userId);

        alert(existingGoal && existingGoal.user_id === userId ? '目標を更新しました' : '新しい目標を設定しました');
      }
    } catch (error) {
      alert('操作に失敗しました：' + (error.response?.data?.error || error.message || 'Unknown error'));
    }
  };

  const openModal = (type) => {
    setModalType(type);
    if (type === "targetDate") {

      setIsCalendarModalOpen(true);
      setModalValue(targetDate ? new Date(targetDate) : new Date());
    } else {
      setModalValue(type === "currentWeight" ? currentWeight : targetWeight);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    if (modalType === "currentWeight") {
      setCurrentWeight(modalValue);
    } else if (modalType === "targetWeight") {
      setTargetWeight(modalValue);
    }
    setIsModalOpen(false);
  };

  const handleDateChange = (date) => {
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    setModalValue(offsetDate);
    setTargetDate(offsetDate.toISOString().split('T')[0]);
    setIsCalendarModalOpen(false);
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
    if (e.target.className === "goal-setting-modal") {
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
        <button type="submit" className="goal-setting-button">
          {existingGoal && existingGoal.user_id === userId ? '更新' : '設定'}
        </button>
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

      {isCalendarModalOpen && (
        <div className="goal-setting-calendar-modal-overlay" onClick={() => setIsCalendarModalOpen(false)}>
          <div className="goal-setting-calendar-modal" onClick={(e) => e.stopPropagation()}>
            <Calendar
              onChange={handleDateChange}
              value={modalValue}
              formatShortWeekday={CalenderFormatShortWeekday}
              tileClassName={CalenderTileClassName}
              tileContent={CalenderTileContent}
            />
          </div>
        </div>
      )}

      {isModalOpen && (
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
import React, { useState } from "react";
import Header from "../Header/Header";
import "./styles/GoalSetting.css";

const GoalSetting = () => {
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // 設定ボタンがクリックされたときの処理をここに追加
    console.log("現在の体重:", currentWeight);
    console.log("目標体重:", targetWeight);
    console.log("目標達成予定日:", targetDate);
  };

  return (
    <div>
      <Header title="目標設定" />
      <h1>目標設定</h1>
      <form className="goal-setting-form" onSubmit={handleSubmit}>
        <div>
          <label className="goal-setting-label">現在の体重:</label>
          <input
            type="number"
            className="goal-setting-input"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
          />
        </div>
        <div>
          <label className="goal-setting-label">目標体重:</label>
          <input
            type="number"
            className="goal-setting-input"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
          />
        </div>
        <div>
          <label className="goal-setting-label">目標達成予定日:</label>
          <input
            type="date"
            className="goal-setting-input"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>
        <button type="submit" className="goal-setting-button">設定</button>
      </form>
    </div>
  );
};

export default GoalSetting;
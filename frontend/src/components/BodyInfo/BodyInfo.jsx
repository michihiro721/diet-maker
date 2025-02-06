import React, { useState } from "react";
import "./styles/BodyInfo.css";

const BodyInfo = () => {
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [bmr, setBmr] = useState(null);

  const calculateBMR = () => {
    let bmrValue;
    if (gender === "男性") {
      bmrValue = 88.36 + 13.4 * weight + 4.8 * height - 5.7 * age;
    } else if (gender === "女性") {
      bmrValue = 447.6 + 9.2 * weight + 3.1 * height - 4.3 * age;
    }
    setBmr(bmrValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateBMR();
  };

  return (
    <div className="body-info-wrapper">
      <div className="body-info-container">
        <form onSubmit={handleSubmit} className="body-info-form">
          <div className="body-info-form-group">
            <label>性別</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="body-info-select">
              <option value="">選択してください</option>
              <option value="男性">男性</option>
              <option value="女性">女性</option>
            </select>
          </div>
          <div className="body-info-form-group">
            <label>身長 (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="body-info-input"
            />
          </div>
          <div className="body-info-form-group">
            <label>体重 (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="body-info-input"
            />
          </div>
          <div className="body-info-form-group">
            <label>年齢 (歳)</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="body-info-input"
            />
          </div>
          <button type="submit" className="body-info-button">設定</button>
        </form>
        {bmr && (
          <div className="body-info-bmr-result">
            <h2>基礎代謝</h2>
            <p>{bmr.toFixed(2)} kcal/day</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyInfo;
import React, { useState } from "react";
import "./styles/BodyInfo.css";
import CalculatorModal from "./CalculatorModal"; // CalculatorModalコンポーネントをインポート

const BodyInfo = () => {
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [bmr, setBmr] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState("");
  const [error, setError] = useState("");

  const calculateBMR = () => {
    const heightValue = parseFloat(height);
    const weightValue = parseFloat(weight);
    const ageValue = parseFloat(age);

    let bmrValue;
    if (gender === "男性") {
      bmrValue = 88.36 + 13.4 * weightValue + 4.8 * heightValue - 5.7 * ageValue;
    } else if (gender === "女性") {
      bmrValue = 447.6 + 9.2 * weightValue + 3.1 * heightValue - 4.3 * ageValue;
    }
    setBmr(bmrValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!gender || !height || !weight || !age) {
      setError("全ての項目を入力してください");
      return;
    }
    setError("");
    calculateBMR();
  };

  const handleInputClick = (field) => {
    setCurrentField(field);
    setModalOpen(true);
  };

  const handleSave = (value) => {
    if (currentField === "height") {
      setHeight(value + " cm");
    } else if (currentField === "weight") {
      setWeight(value + " kg");
    } else if (currentField === "age") {
      setAge(value + " 歳");
    }
    setModalOpen(false);
  };

  return (
    <div className="body-info-wrapper">
      <div className="body-info-container">
        <form onSubmit={handleSubmit} className="body-info-form">
          {error && <p className="body-info-error-message">{error}</p>}
          <div className="body-info-form-group">
            <label>性別</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="body-info-select">
              <option value="">選択してください</option>
              <option value="男性">男性</option>
              <option value="女性">女性</option>
            </select>
          </div>
          <div className="body-info-form-group">
            <label>身長</label>
            <input
              type="text"
              value={height}
              onClick={() => handleInputClick("height")}
              readOnly
              className="body-info-input"
            />
          </div>
          <div className="body-info-form-group">
            <label>体重</label>
            <input
              type="text"
              value={weight}
              onClick={() => handleInputClick("weight")}
              readOnly
              className="body-info-input"
            />
          </div>
          <div className="body-info-form-group">
            <label>年齢</label>
            <input
              type="text"
              value={age}
              onClick={() => handleInputClick("age")}
              readOnly
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
      <CalculatorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default BodyInfo;
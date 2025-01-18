import React, { useState } from "react";
import './training record.css'; // CSSファイルをインポート

const TrainingRecord = () => {
  const [sets, setSets] = useState([
    { weight: 85, reps: 5, complete: false, timer: "2:00" },
    { weight: 85, reps: 5, complete: false, timer: "2:00" },
    { weight: 85, reps: 5, complete: false, timer: "2:00" },
  ]);

  const handleAddSet = () => {
    setSets([...sets, { weight: 85, reps: 5, complete: false, timer: "2:00" }]);
  };

  const handleRemoveSet = (index) => {
    const updatedSets = sets.filter((_, i) => i !== index);
    setSets(updatedSets);
  };

  const handleUpdateSet = (index, field, value) => {
    const updatedSets = sets.map((set, i) =>
      i === index ? { ...set, [field]: value } : set
    );
    setSets(updatedSets);
  };

  return (
    <div className="training-record-container">
      <h2 className="training-record-title">トレーニング記録 : 12月15日（木）</h2>
      <div className="training-info">
        <p>
          種目：<input type="text" defaultValue="ベンチプレス" readOnly />
        </p>
        <p>対象部位：胸</p>
        <p>MAX重量：95kg</p>
        <p>消費カロリー：xxxkcal</p>
      </div>

      <table className="training-table">
        <thead>
          <tr>
            <th>セット</th>
            <th>kg</th>
            <th>回</th>
            <th>タイマー</th>
            <th>完了</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {sets.map((set, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="number"
                  value={set.weight}
                  onChange={(e) => handleUpdateSet(index, "weight", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={set.reps}
                  onChange={(e) => handleUpdateSet(index, "reps", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={set.timer}
                  onChange={(e) => handleUpdateSet(index, "timer", e.target.value)}
                />
              </td>
              <td>
                <button
                  onClick={() => handleUpdateSet(index, "complete", !set.complete)}
                  className={set.complete ? "complete-button" : "incomplete-button"}
                >
                  {set.complete ? "レ" : ""}
                </button>
              </td>
              <td>
                <button
                  onClick={() => handleRemoveSet(index)}
                  className="delete-button"
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="add-set-button-container">
        <button
          onClick={handleAddSet}
          className="add-set-button"
        >
          + セット追加
        </button>
      </div>
    </div>
  );
};

export default TrainingRecord;
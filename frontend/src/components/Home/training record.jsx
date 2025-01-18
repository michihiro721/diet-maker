import React, { useState } from "react";

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
    <div style={{ height: "100vh", overflowY: "auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>トレーニング記録 : 12月15日（木）</h2>
      <div style={{ backgroundColor: "#f0f8ff", padding: "10px", borderRadius: "5px" }}>
        <p>
          種目：<input type="text" defaultValue="ベンチプレス" readOnly />
        </p>
        <p>対象部位：胸</p>
        <p>MAX重量：95kg</p>
        <p>消費カロリー：xxxkcal</p>
      </div>

      <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>セット</th>
            <th>kg</th>
            <th>回</th>
            <th>完了</th>
            <th>タイマー</th>
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
                  style={{ width: "60px" }}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={set.reps}
                  onChange={(e) => handleUpdateSet(index, "reps", e.target.value)}
                  style={{ width: "60px" }}
                />
              </td>
              <td>
                <button
                  onClick={() => handleUpdateSet(index, "complete", !set.complete)}
                  style={{
                    backgroundColor: set.complete ? "lightgreen" : "lightcoral",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                  }}
                >
                  {set.complete ? "完" : "レ"}
                </button>
              </td>
              <td>
                <input
                  type="text"
                  value={set.timer}
                  onChange={(e) => handleUpdateSet(index, "timer", e.target.value)}
                  style={{ width: "60px" }}
                />
              </td>
              <td>
                <button
                  onClick={() => handleRemoveSet(index)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                  }}
                >
                  セット削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleAddSet}
        style={{
          marginTop: "20px",
          backgroundColor: "lightblue",
          border: "none",
          borderRadius: "5px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        + セット追加
      </button>
    </div>
  );
};

export default TrainingRecord;
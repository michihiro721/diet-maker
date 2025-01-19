import React, { useState } from "react";
import "./styles/customized-training.css";

const CustomizedTraining = ({ currentExercise, onExerciseChange, closeModal }) => {
  const [selectedPart, setSelectedPart] = useState("胸");
  const exercises = {
    胸: ["ベンチプレス", "インクラインベンチプレス", "ダンベルプレス"],
    背中: ["ラットプルダウン", "デッドリフト", "懸垂"],
    肩: ["ショルダープレス", "サイドレイズ", "フロントレイズ"],
    腕: ["アームカール", "トライセプスエクステンション", "ダンベルカール"],
    脚: ["スクワット", "レッグプレス", "カーフレイズ"],
    腹筋: ["クランチ", "プランク", "レッグレイズ"],
  };

  const handlePartChange = (part) => {
    setSelectedPart(part);
  };

  const handleExerciseSelect = (exercise) => {
    onExerciseChange(exercise); // 親コンポーネントの状態を更新
    closeModal();
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="part-selector">
          {Object.keys(exercises).map((part) => (
            <button
              key={part}
              className={`part-button ${part === selectedPart ? "active" : ""}`}
              onClick={() => handlePartChange(part)}
            >
              {part}
            </button>
          ))}
        </div>
        <div className="exercise-list">
          {exercises[selectedPart].map((exercise) => (
            <p
              key={exercise}
              className="exercise-item"
              onClick={() => handleExerciseSelect(exercise)}
            >
              {exercise}
            </p>
          ))}
        </div>
        <button className="close-button" onClick={closeModal}>
          閉じる
        </button>
      </div>
    </div>
  );
};

export default CustomizedTraining;
// Reactをインポート
import React from "react";
// PartSelector用のCSSファイルをインポート
import './styles/PartSelector.css';

// PartSelectorコンポーネントの定義
const PartSelector = ({ selectedPart, handlePartChange, exercises }) => {
  return (
    // 部位選択ボタンのコンテナ
    <div className="part-selector">
      {/* トレーニング部位のリストをマッピングしてボタンを表示 */}
      {Object.keys(exercises).map((part) => (
        // 部位選択ボタン
        <button
          key={part}
          className={`part-button ${part === selectedPart ? "active" : ""}`}
          onClick={() => handlePartChange(part)}
        >
          {part}
        </button>
      ))}
    </div>
  );
};

// PartSelectorコンポーネントをエクスポート
export default PartSelector;
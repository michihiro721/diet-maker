// このファイルは、トレーニング種目選択モーダルウィンドウのコンポーネントを定義しています。
// モーダルウィンドウは、トレーニング種目を選択するためのインターフェースを提供し、
// 部位ごとの種目リストを表示します。

import React, { useState } from "react";
import "./styles/customized-training.css";

const CustomizedTraining = ({ currentExercise, onExerciseChange, closeModal }) => {
  // 選択された部位を管理する状態
  const [selectedPart, setSelectedPart] = useState("胸");
  // 検索用の入力値を管理する状態
  const [searchTerm, setSearchTerm] = useState("");

  // 各部位ごとのトレーニング種目リスト
  const exercises = {
    胸: [
      "ベンチプレス", "インクラインベンチプレス", "ダンベルプレス", "ダンベルフライ", "ケーブルクロスオーバー",
      "ペックデックフライ", "プッシュアップ", "ディップス", "チェストプレス", "スミスマシンベンチプレス"
    ],
    背中: [
      "ラットプルダウン", "デッドリフト", "懸垂", "ベントオーバーロウ", "シーテッドロウ",
      "ワンハンドダンベルロウ", "Tバーロウ", "プルオーバー", "バックエクステンション", "リバースフライ"
    ],
    肩: [
      "ショルダープレス", "サイドレイズ", "フロントレイズ", "リアレイズ", "アップライトロウ",
      "アーノルドプレス", "ダンベルショルダープレス", "ケーブルサイドレイズ", "ケーブルフロントレイズ", "ケーブルリアレイズ"
    ],
    腕: [
      "アームカール", "トライセプスエクステンション", "ダンベルカール", "ケーブルプレスダウン", "ケーブルカール",
      "プリーチャーカール", "ハンマーカール", "フレンチプレス", "キックバック", "リストカール"
    ],
    脚: [
      "スクワット", "レッグプレス", "カーフレイズ", "レッグエクステンション", "レッグカール",
      "ランジ", "ブルガリアンスクワット", "シシースクワット", "ヒップスラスト", "グルートブリッジ"
    ],
    腹筋: [
      "クランチ", "プランク", "レッグレイズ", "シットアップ", "バイシクルクランチ",
      "ロシアンツイスト", "マウンテンクライマー", "ヒールタッチ", "トゥータッチ", "ハンギングレッグレイズ"
    ]
  };

  // 部位が変更されたときの処理
  const handlePartChange = (part) => {
    setSelectedPart(part);
    setSearchTerm("");
  };

  // 種目が選択されたときの処理
  const handleExerciseSelect = (exercise) => {
    // 選択された種目がどの部位に属するかを判断
    const part = Object.keys(exercises).find(part => exercises[part].includes(exercise));
    onExerciseChange(exercise, part); // 親コンポーネントの状態を更新
    closeModal(); // モーダルを閉じる
  };

  // 検索結果に基づいて種目リストをフィルタリング
  const filteredExercises = exercises[selectedPart].filter((exercise) =>
    exercise.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-contents" onClick={(e) => e.stopPropagation()}>
        {/* 部位選択ボタン */}
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
        {/* 種目検索入力フィールド */}
        <input
          type="text"
          id="exercise-search"
          name="exercise-search"
          placeholder="種目を検索"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {/* 種目リスト */}
        <div className="exercise-list">
          {filteredExercises.map((exercise) => (
            <p
              key={exercise}
              className="exercise-item"
              onClick={() => handleExerciseSelect(exercise)}
            >
              {exercise}
            </p>
          ))}
        </div>
        {/* モーダルを閉じるボタン */}
        <button className="close-button" onClick={closeModal}>
          閉じる
        </button>
      </div>
    </div>
  );
};

export default CustomizedTraining;
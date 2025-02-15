// Reactと必要なフック、コンポーネントをインポート
import React, { useState, useEffect, useMemo } from "react";
import PartSelector from "./PartSelector";
import SearchInput from "./SearchInput";
import ExerciseList from "./ExerciseList";
import CloseButton from "./CloseButton";
import './styles/ModalOverlay.css';
import './styles/ModalContents.css';

// CustomizedTrainingコンポーネントの定義
const CustomizedTraining = ({ currentExercise, onExerciseChange, closeModal }) => {
  // 部位選択の状態を管理するためのuseStateフック
  const [selectedPart, setSelectedPart] = useState("胸");
  // 検索語の状態を管理するためのuseStateフック
  const [searchTerm, setSearchTerm] = useState("");
  // フィルタリングされたトレーニング種目の状態を管理するためのuseStateフック
  const [filteredExercises, setFilteredExercises] = useState([]);

  // トレーニング種目のデータ
  const exercises = useMemo(() => ({
    胸: ["ベンチプレス", "インクラインベンチプレス", "ダンベルプレス", "インクラインダンベルプレス", "ダンベルフライ", "インクラインダンベルフライ", "ケーブルクロスオーバー", "ペックフライ", "プッシュアップ", "ディップス", "ディップス（椅子）" ,"チェストプレス", "ダンベルプルオーバー", "ディクラインベンチプレス", "ディクラインダンベルプレス", "ディクラインダンベルフライ", "腕立て伏せ"],
    背中: ["ラットプルダウン", "デットリフト", "懸垂", "ベントオーバーロウ", "ダンベルローイング", "シーテッドロー", "ワンハンドダンベルロウ", "Tバーロウ", "プルオーバー", "バックエクステンション","フェイスプル", "シュラッグ" ,"ダンベルリアデルトフライ"],
    肩: ["バーベルショルダープレス", "サイドレイズ", "リアレイズ", "アップライトロウ", "アーノルドプレス", "ダンベルショルダープレス"],
    腕: ["バーベルカール", "アームカール", "トライセプスエクステンション", "ダンベルカール", "プリーチャーカール", "ハンマーカール", "フレンチプレス", "キックバック", "リストカール", "リバースリストカール", "スカルクラッシャー", "インクラインダンベルカール" ,"ケーブルプルオーバー"],
    脚: ["バーベルスクワット", "スクワット", "レッグプレス", "カーフレイズ", "レッグエクステンション", "レッグカール", "ブルガリアンスクワット", "シシースクワット", "ヒップスラスト" ,"アブダクション"],
    腹筋: ["クランチ", "レッグレイズ", "シットアップ", "ロシアンツイスト", "ハンギングレッグレイズ"],
    有酸素: ["トレッドミル", "ランニング" , "ウォーキング", "エアロバイク", "ストレッチ"]
  }), []);

  // 部位選択が変更されたときの処理
  const handlePartChange = (part) => {
    setSelectedPart(part);
    setSearchTerm("");
  };

  // トレーニング種目が選択されたときの処理
  const handleExerciseSelect = (exercise) => {
    const part = Object.keys(exercises).find(part => exercises[part].includes(exercise));
    onExerciseChange(exercise, part);
    closeModal();
  };

  // 部位選択や検索語が変更されたときにトレーニング種目をフィルタリング
  useEffect(() => {
    const filtered = exercises[selectedPart].filter((exercise) =>
      exercise.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExercises(filtered);
  }, [selectedPart, searchTerm, exercises]);

  return (
    // モーダルのオーバーレイ
    <div className="modal-overlay" onClick={closeModal}>
      {/* モーダルのコンテンツ */}
      <div className="modal-contents" onClick={(e) => e.stopPropagation()}>
        {/* 部位選択コンポーネント */}
        <PartSelector selectedPart={selectedPart} handlePartChange={handlePartChange} exercises={exercises} />
        {/* 検索入力コンポーネント */}
        <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {/* トレーニング種目リストコンポーネント */}
        <ExerciseList filteredExercises={filteredExercises} handleExerciseSelect={handleExerciseSelect} />
        {/* 閉じるボタンコンポーネント */}
        <CloseButton closeModal={closeModal} />
      </div>
    </div>
  );
};

// CustomizedTrainingコンポーネントをエクスポート
export default CustomizedTraining;
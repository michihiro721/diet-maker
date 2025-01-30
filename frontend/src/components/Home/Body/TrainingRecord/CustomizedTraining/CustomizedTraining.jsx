// Reactと必要なフック、コンポーネントをインポート
import React, { useState, useEffect } from "react";
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
  const exercises = {
    胸: ["ベンチプレス", "インクラインベンチプレス", "ダンベルプレス", "ダンベルフライ", "ケーブルクロスオーバー", "ペックデックフライ", "プッシュアップ", "ディップス", "チェストプレス", "スミスマシンベンチプレス", "ダンベルプルオーバー", "ケーブルフライ", "マシンフライ", "マシンチェストプレス", "ディクラインベンチプレス", "ディクラインダンベルプレス", "ディクラインダンベルフライ", "ディクラインケーブルクロスオーバー", "ディクラインペックデックフライ", "ディクラインプッシュアップ", "ディクラインディップス"],
    背中: ["ラットプルダウン", "デッドリフト", "懸垂", "ベントオーバーロウ", "シーテッドロウ", "ワンハンドダンベルロウ", "Tバーロウ", "プルオーバー", "バックエクステンション", "リバースフライ", "フェイスプル", "シュラッグ"],
    肩: ["ショルダープレス", "サイドレイズ", "フロントレイズ", "リアレイズ", "アップライトロウ", "アーノルドプレス", "ダンベルショルダープレス", "ケーブルサイドレイズ", "ケーブルフロントレイズ", "ケーブルリアレイズ", "マシンショルダープレス", "マシンサイドレイズ", "マシンフロントレイズ", "マシンリアレイズ"],
    腕: ["アームカール", "トライセプスエクステンション", "ダンベルカール", "ケーブルプレスダウン", "ケーブルカール", "プリーチャーカール", "ハンマーカール", "フレンチプレス", "キックバック", "リストカール", "リバースリストカール", "スカルクラッシャー", "コンセントレーションカール", "インクラインダンベルカール"],
    脚: ["スクワット", "レッグプレス", "カーフレイズ", "レッグエクステンション", "レッグカール", "ランジ", "ブルガリアンスクワット", "シシースクワット", "ヒップスラスト", "グルートブリッジ"],
    腹筋: ["クランチ", "プランク", "レッグレイズ", "シットアップ", "バイシクルクランチ", "ロシアンツイスト", "マウンテンクライマー", "ヒールタッチ", "トゥータッチ", "ハンギングレッグレイズ"]
  };

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
  }, [selectedPart, searchTerm]);

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
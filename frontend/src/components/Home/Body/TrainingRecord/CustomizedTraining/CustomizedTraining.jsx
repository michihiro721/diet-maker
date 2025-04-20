import React, { useState, useEffect, useMemo } from "react";
import PropTypes from 'prop-types';
import PartSelector from "./PartSelector";
import SearchInput from "./SearchInput";
import ExerciseList from "./ExerciseList";
import CloseButton from "./CloseButton";
import './styles/ModalOverlay.css';
import './styles/ModalContents.css';


const CustomizedTraining = ({ onExerciseChange, closeModal }) => {
  const [selectedPart, setSelectedPart] = useState("胸");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredExercises, setFilteredExercises] = useState([]);

  // トレーニング種目
  const exercises = useMemo(() => ({
    胸: ["ベンチプレス", "インクラインベンチプレス", "ダンベルプレス", "インクラインダンベルプレス", "ダンベルフライ", "インクラインダンベルフライ", "ケーブルクロスオーバー", "ペックフライ", "ディップス", "ディップス（椅子）" ,"チェストプレス", "ダンベルプルオーバー", "ディクラインベンチプレス", "ディクラインダンベルプレス", "ディクラインダンベルフライ", "腕立て伏せ"],
    背中: ["ラットプルダウン", "デットリフト", "懸垂", "ベントオーバーロウ", "ダンベルローイング", "シーテッドロー", "ワンハンドダンベルロウ", "Tバーロウ", "プルオーバー", "バックエクステンション","フェイスプル", "シュラッグ" ,"ダンベルリアデルトフライ"],
    肩: ["ミリタリープレス", "サイドレイズ", "リアレイズ", "アップライトロウ", "アーノルドプレス", "ダンベルショルダープレス", "フロントレイズ"],
    腕: ["バーベルカール", "アームカール", "トライセプスエクステンション", "ダンベルカール", "プリーチャーカール", "ハンマーカール", "フレンチプレス", "キックバック", "リストカール", "リバースリストカール", "スカルクラッシャー", "インクラインダンベルカール" ,"ケーブルプルオーバー"],
    脚: ["バーベルスクワット", "スクワット", "レッグプレス", "カーフレイズ", "レッグエクステンション", "レッグカール", "ブルガリアンスクワット", "シシースクワット", "ヒップスラスト" ,"アブダクション"],
    腹筋: ["クランチ", "レッグレイズ", "シットアップ", "ロシアンツイスト", "ハンギングレッグレイズ", "アブドミナルクランチ", "アブローラー"],
    有酸素: ["トレッドミル", "ランニング" , "ウォーキング", "エアロバイク", "ストレッチ", "水中ウォーキング", "縄跳び" ,"階段" ,"バーピージャンプ"]
  }), []);


  const handlePartChange = (part) => {
    setSelectedPart(part);
    setSearchTerm("");
  };


  const handleExerciseSelect = (exercise) => {
    const part = Object.keys(exercises).find(part => exercises[part].includes(exercise));
    onExerciseChange(exercise, part);
    closeModal();
  };


  useEffect(() => {
    const filtered = exercises[selectedPart].filter((exercise) =>
      exercise.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExercises(filtered);
  }, [selectedPart, searchTerm, exercises]);

  return (
    <div className="modal-overlay" onClick={closeModal}>
      {/* モーダル */}
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

CustomizedTraining.propTypes = {
  onExerciseChange: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired
};

export default CustomizedTraining;
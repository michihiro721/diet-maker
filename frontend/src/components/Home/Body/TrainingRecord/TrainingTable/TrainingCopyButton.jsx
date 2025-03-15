// frontend/src/components/Home/Body/TrainingRecord/TrainingTable/TrainingCopyButton.jsx
import React, { useState } from "react";
import TrainingCopyModal from "../../../../Posts/TrainingCopyModal";
import "./styles/TrainingCopyButton.css";

const TrainingCopyButton = ({ trainings, workouts, onTrainingCopied }) => {
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  
  // ユーザーIDを取得
  const userId = localStorage.getItem('userId');
  
  // トレーニングデータを適切な形式に変換
  const formatTrainingData = () => {
    if (!trainings || trainings.length === 0) {
      return [];
    }
    
    return trainings.flatMap(training => {
      // workoutオブジェクトを取得
      const workout = workouts.find(w => w.name === training.exercise);
      
      if (!workout) {
        return [];
      }
      
      // 各セットごとにデータを作成
      return training.sets.map((set, index) => {
        // 有酸素運動かどうかを判断
        const isAerobic = !set.hasOwnProperty('reps');
        
        return {
          workout_id: workout.id,
          sets: index + 1, // セット番号 (1から始まる)
          weight: isAerobic ? set.minutes : set.weight,
          reps: isAerobic ? 0 : set.reps
        };
      });
    });
  };
  
  // モーダルを開く
  const openCopyModal = () => {
    if (!userId) {
      alert("ログインしていないとトレーニングデータをコピーできません。");
      return;
    }
    
    if (!trainings || trainings.length === 0) {
      alert("コピーするトレーニングデータがありません。");
      return;
    }
    
    setIsCopyModalOpen(true);
  };
  
  // モーダルを閉じる
  const closeCopyModal = (success = false) => {
    setIsCopyModalOpen(false);
    // 成功した場合は親コンポーネントに通知
    if (success && onTrainingCopied) {
      onTrainingCopied();
    }
  };
  
  return (
    <>
      <div className="training-copy-container">
        <button 
          className="training-copy-button"
          onClick={openCopyModal}
          disabled={!userId || !trainings || trainings.length === 0}
        >
          メニューをコピー
        </button>
      </div>
      
      {isCopyModalOpen && (
        <TrainingCopyModal
          isOpen={isCopyModalOpen}
          onClose={closeCopyModal}
          trainingData={formatTrainingData()}
          userId={userId}
        />
      )}
    </>
  );
};

export default TrainingCopyButton;
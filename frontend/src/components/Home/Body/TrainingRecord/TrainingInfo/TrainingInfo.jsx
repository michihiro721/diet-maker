import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import CustomizedTraining from '../CustomizedTraining/CustomizedTraining';
import { calculateTotalCalories, aerobicExercises } from './CaloriesUtils';
import './styles/training-info.css';

const TrainingInfo = ({ 
  currentExercise, 
  currentPart, 
  onExerciseChange, 
  maxWeight,
  sets = [],
  userWeight = 70  // ユーザーの体重（デフォルト70kg）
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isAerobic, setIsAerobic] = useState(false);
  const [calories, setCalories] = useState(0);

  // 有酸素運動かどうかチェック
  useEffect(() => {
    setIsAerobic(aerobicExercises.includes(currentExercise));
  }, [currentExercise]);

  // 消費カロリーの計算
  useEffect(() => {
    if (sets && sets.length > 0) {
      // METs値を使用した計算方法でカロリーを算出
      // カロリー = METs × 体重(kg) × 時間 × 1.05
      // 時間(時) = (レップ数 × 5秒) / 3600
      const totalCalories = calculateTotalCalories(
        sets, 
        currentExercise, 
        isAerobic, 
        userWeight
      );
      setCalories(totalCalories);
    } else {
      setCalories(0);
    }
  }, [sets, currentExercise, isAerobic, userWeight]);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleExerciseChange = (exercise, part) => {
    onExerciseChange(exercise, part);
    closeModal();
  };

  // カロリー表示用のフォーマット関数
  const formatCalories = (value) => {
    if (value <= 0) return 'データなし';
    return `${value} kcal`;
  };

  // 種目が選択されていない場合は「種目を選択してください」を表示
  const displayExercise = currentExercise || "種目を選択してください";

  return (
    <div className="training-info">
      <p>
        種目：
        <span className="exercise-display clickable" onClick={openModal}>
          {displayExercise}
        </span>
      </p>
      <p className="target-part">対象部位：{currentPart || "-"}</p>
      {!isAerobic && <p>MAX重量：{maxWeight || 'データなし'}</p>}
      <p className="calories-info">
        消費カロリー：
        <span className="calories-value">
          {formatCalories(calories)}
        </span>
        {calories > 0 && (
          <span className="calories-tooltip">※表示されるカロリーは推定値です</span>
        )}
      </p>
      {modalVisible && (
        <CustomizedTraining
          currentExercise={currentExercise}
          onExerciseChange={handleExerciseChange}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};


TrainingInfo.propTypes = {
  currentExercise: PropTypes.string,
  currentPart: PropTypes.string,
  onExerciseChange: PropTypes.func.isRequired,
  maxWeight: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  sets: PropTypes.array,
  userWeight: PropTypes.number
};

export { aerobicExercises };
export default TrainingInfo;
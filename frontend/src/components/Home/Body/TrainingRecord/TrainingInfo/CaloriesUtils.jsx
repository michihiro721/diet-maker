// caloriesUtils.js
// トレーニングの消費カロリー計算に関連するユーティリティ関数

// 有酸素運動の種目リスト
const aerobicExercises = [
    "トレッドミル", "ランニング", "ウォーキング", "エアロバイク", 
    "ストレッチ", "水中ウォーキング", "縄跳び", "階段"
  ];
  
  // 種目ごとのMETs値（代謝当量）マップ - 科学的な研究に基づく値
  const exerciseMETs = {
    // 胸筋
    "ベンチプレス": 5.0,
    "インクラインベンチプレス": 5.0,
    "ダンベルプレス": 4.5,
    "インクラインダンベルプレス": 4.5,
    "ダンベルフライ": 3.5,
    "インクラインダンベルフライ": 3.5,
    "ケーブルクロスオーバー": 3.5,
    "ペックフライ": 3.5,
    "ディップス": 4.0,
    "ディップス（椅子）": 3.5,
    "チェストプレス": 4.0,
    "ダンベルプルオーバー": 3.5,
    "ディクラインベンチプレス": 5.0,
    "ディクラインダンベルプレス": 4.5,
    "ディクラインダンベルフライ": 3.5,
    "腕立て伏せ": 3.8,
    
    // 背中
    "ラットプルダウン": 4.0,
    "デットリフト": 6.5,
    "懸垂": 5.0,
    "ベントオーバーロウ": 5.0,
    "ダンベルローイング": 4.5,
    "シーテッドロー": 4.0,
    "ワンハンドダンベルロウ": 4.5,
    "Tバーロウ": 5.0,
    "プルオーバー": 3.5,
    "バックエクステンション": 3.5,
    "フェイスプル": 3.0,
    "シュラッグ": 3.5,
    "ダンベルリアデルトフライ": 3.5,
    
    // 肩
    "ミリタリープレス": 4.5,
    "サイドレイズ": 3.0,
    "リアレイズ": 3.0,
    "アップライトロウ": 4.0,
    "アーノルドプレス": 4.5,
    "ダンベルショルダープレス": 4.5,
    "フロントレイズ": 3.0,
    
    // 腕
    "バーベルカール": 3.5,
    "アームカール": 3.0,
    "トライセプスエクステンション": 3.0,
    "ダンベルカール": 3.0,
    "プリーチャーカール": 3.0,
    "ハンマーカール": 3.0,
    "フレンチプレス": 3.0,
    "キックバック": 3.0,
    "リストカール": 2.5,
    "リバースリストカール": 2.5,
    "スカルクラッシャー": 3.5,
    "インクラインダンベルカール": 3.0,
    "ケーブルプルオーバー": 3.5,
    
    // 脚
    "バーベルスクワット": 7.0,
    "スクワット": 5.5,
    "レッグプレス": 6.0,
    "カーフレイズ": 3.0,
    "レッグエクステンション": 3.5,
    "レッグカール": 3.5,
    "ブルガリアンスクワット": 6.0,
    "シシースクワット": 5.5,
    "ヒップスラスト": 5.0,
    "アブダクション": 3.0,
    
    // 腹筋
    "クランチ": 3.0,
    "レッグレイズ": 3.5,
    "シットアップ": 3.5,
    "ロシアンツイスト": 3.5,
    "ハンギングレッグレイズ": 4.5,
    "アブドミナルクランチ": 3.0,
    "アブローラー": 4.0,
    
    // 有酸素運動
    "トレッドミル": 9.0,
    "ランニング": 8.3,
    "ウォーキング": 3.5,
    "エアロバイク": 7.0,
    "ストレッチ": 2.5,
    "水中ウォーキング": 4.5,
    "縄跳び": 10.0,
    "階段": 9.0,
    
    // デフォルト値
    "default": 4.0
  };
  
  /**
   * ウェイトトレーニングの消費カロリーを計算する関数（METs方式）
   * 計算式：カロリー = METs × 体重(kg) × 時間(時) × 1.05
   * @param {number} weight - 重量（kg）
   * @param {number} reps - 回数
   * @param {string} exerciseType - トレーニング種目
   * @param {number} userWeight - ユーザーの体重（kg）
   * @return {number} - 消費カロリー
   */
  const calculateWeightTrainingCalories = (weight, reps, exerciseType, userWeight = 70) => {
    if (!weight || !reps) return 0;
    
    // METs値の取得
    const mets = exerciseMETs[exerciseType] || exerciseMETs['default'];
    
    // 1レップを5秒と仮定して時間（時間単位）を計算
    const timeInHours = (reps * 5) / 3600; // 5秒/レップ ÷ 3600秒/時間
    
    // 重量に応じた調整係数
    const weightFactor = Math.min(1.0 + (weight / (userWeight * 2)), 1.5);
    
    // 消費カロリー計算（カロリー = METs × 体重 × 時間 × 1.05）
    const calories = mets * userWeight * timeInHours * 1.05 * weightFactor;
    
    return Math.round(calories);
  };
  
  /**
   * 有酸素運動の消費カロリーを計算する関数（METs方式）
   * 計算式：カロリー = METs × 体重(kg) × 時間(時) × 1.05
   * @param {string} exerciseType - 運動種目
   * @param {number} minutes - 運動時間（分）
   * @param {number} userWeight - ユーザーの体重（kg）
   * @return {number} - 消費カロリー
   */
  const calculateAerobicCalories = (exerciseType, minutes = 30, userWeight = 70) => {
    if (!minutes) return 0;
    
    // METs値の取得
    const mets = exerciseMETs[exerciseType] || exerciseMETs['default'];
    
    // 時間を時間単位に変換（分→時間）
    const timeInHours = minutes / 60;
    
    // 消費カロリー計算（カロリー = METs × 体重 × 時間 × 1.05）
    const calories = mets * userWeight * timeInHours * 1.05;
    
    return Math.round(calories);
  };
  
  /**
   * トレーニングセットの配列から総消費カロリーを計算
   * @param {Array} sets - トレーニングセットの配列
   * @param {string} exerciseType - トレーニング種目
   * @param {boolean} isAerobic - 有酸素運動かどうか
   * @param {number} userWeight - ユーザーの体重（kg）
   * @returns {number} - 総消費カロリー
   */
  const calculateTotalCalories = (sets, exerciseType, isAerobic, userWeight = 70) => {
    if (!sets || sets.length === 0) return 0;
    
    let totalCalories = 0;
    
    if (isAerobic) {
      // 有酸素運動の場合
      sets.forEach(set => {
        // 有酸素運動はminutesフィールドを使用
        const minutes = set.minutes || 30;
        totalCalories += calculateAerobicCalories(exerciseType, minutes, userWeight);
      });
    } else {
      // ウェイトトレーニングの場合
      sets.forEach(set => {
        const weight = set.weight || 0;
        const reps = set.reps || 0;
        totalCalories += calculateWeightTrainingCalories(weight, reps, exerciseType, userWeight);
      });
    }
    
    return totalCalories;
  };
  
  /**
   * すべてのトレーニングの合計消費カロリーを計算
   * @param {Array} trainings - トレーニングオブジェクトの配列
   * @param {number} userWeight - ユーザーの体重（kg）
   * @returns {number} - 合計消費カロリー
   */
  const calculateTotalSessionCalories = (trainings, userWeight = 70) => {
    if (!trainings || trainings.length === 0) return 0;
    
    let sessionTotalCalories = 0;
    
    trainings.forEach(training => {
      const isAerobic = aerobicExercises.includes(training.exercise);
      const exerciseCalories = calculateTotalCalories(
        training.sets, 
        training.exercise, 
        isAerobic, 
        userWeight
      );
      sessionTotalCalories += exerciseCalories;
    });
    
    return sessionTotalCalories;
  };
  
  export {
    calculateWeightTrainingCalories,
    calculateAerobicCalories,
    calculateTotalCalories,
    calculateTotalSessionCalories,
    exerciseMETs,
    aerobicExercises
  };
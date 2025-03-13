import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/TrainingRecordDetail.css";

const api = axios.create({
  baseURL: "https://diet-maker-d07eb3099e56.herokuapp.com"
});

const TrainingRecordDetail = () => {
  const { postId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // URLからクエリパラメータを取得
  const queryParams = new URLSearchParams(location.search);
  const dateParam = queryParams.get('date');

  const [post, setPost] = useState(null);
  const [achievementData, setAchievementData] = useState({
    trainingData: [],
    stepData: null,
    consumedCalories: null,
    intakeCalories: null,
    workouts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 投稿データの取得
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        
        // 投稿詳細を取得
        const response = await api.get(`/posts/${postId}`);
        console.log("投稿データ取得:", response.data);
        
        // 日付情報を設定
        const date = dateParam || getPostDate(response.data);
        
        setPost({
          ...response.data,
          achievementDate: date,
          userName: response.data.user?.name || "ユーザー"
        });
        
        // 成果データを取得
        await fetchAchievementData(response.data.user_id, date);
        
      } catch (err) {
        console.error("データの取得に失敗しました", err);
        setError(`エラー: ${err.message}. ステータス: ${err.response?.status || 'N/A'}`);
        setLoading(false);
      }
    };
    
    if (postId) {
      fetchPostData();
    }
  }, [postId, dateParam]);

  // 成果データの取得
  const fetchAchievementData = async (userId, date) => {
    try {
      console.log('成果データ取得開始:', { userId, date });
      
      // 全種目データを取得
      const workoutsResponse = await api.get('/workouts');
      const workoutsData = workoutsResponse.data;
      
      // トレーニングデータを取得
      const trainingResponse = await api.get(`/trainings`, {
        params: { 
          user_id: userId,
          date: date
        }
      });
      
      // 歩数データを取得
      const stepsResponse = await api.get(`/steps`, {
        params: { 
          user_id: userId,
          date: date
        }
      });
      
      // 消費カロリーデータを取得
      const consumedCaloriesResponse = await api.get(`/daily_calories`, {
        params: {
          user_id: userId,
          date: date
        }
      });
      
      // 摂取カロリーデータを取得
      const intakeCaloriesResponse = await api.get(`/intake_calories`, {
        params: { 
          user_id: userId,
          date: date
        }
      });

      // データをフィルタリング（選択した日付のデータのみ）
      const stepData = stepsResponse.data.find(item => item.date === date) || null;
      const consumedCalories = consumedCaloriesResponse.data.find(item => item.date === date) || null;
      const intakeCalories = intakeCaloriesResponse.data.find(item => item.date === date) || null;

      // トレーニングデータに種目名と種目カテゴリーを追加
      const enhancedTrainingData = trainingResponse.data.map(training => {
        const workout = workoutsData.find(w => w.id === training.workout_id) || {};
        const isAerobic = workout.category === "有酸素";
        
        return {
          ...training,
          workout_name: workout.name || `種目ID: ${training.workout_id}`,
          category: workout.category || '',
          is_aerobic: isAerobic
        };
      });

      // トレーニングデータを種目ごとにグループ化
      const groupedTrainingData = enhancedTrainingData.reduce((groups, training) => {
        const key = `${training.workout_id}-${training.category}`;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(training);
        return groups;
      }, {});

      // 種目ごとにソートされたデータを作成
      let sortedTrainingData = [];
      
      // 各グループから最初のアイテムを取り出して、カテゴリでソート
      const categories = ['胸', '背中', '肩', '腕', '脚', '腹筋', '有酸素'];
      
      // カテゴリでグループ化
      const categoryGroups = {};
      categories.forEach(category => {
        categoryGroups[category] = [];
      });
      
      // 各トレーニンググループをカテゴリグループに振り分け
      Object.values(groupedTrainingData).forEach(group => {
        const category = group[0].category;
        if (categoryGroups[category]) {
          categoryGroups[category].push(group);
        }
      });
      
      // カテゴリグループを順番に展開
      categories.forEach(category => {
        categoryGroups[category].forEach(group => {
          // 各グループ内でセット番号でソート
          const sortedGroup = [...group].sort((a, b) => a.sets - b.sets);
          sortedTrainingData = [...sortedTrainingData, ...sortedGroup];
        });
      });

      setAchievementData({
        trainingData: sortedTrainingData,
        stepData,
        consumedCalories,
        intakeCalories,
        date,
        workouts: workoutsData
      });
      
      console.log('成果データ設定完了:', { 
        date,
        trainings: sortedTrainingData.length,
        steps: stepData?.steps,
        calories: consumedCalories?.total_calories
      });
      
      setLoading(false);
    } catch (error) {
      console.error("成果データの取得に失敗しました:", error);
      setError(`成果データの取得に失敗しました: ${error.message}`);
      setLoading(false);
    }
  };

  // 投稿日付から実際の日付文字列を取得する関数
  const getPostDate = (post) => {
    if (!post || !post.content) return '';
    
    // 新フォーマット: 【YYYY-MM-DD】
    const newDateRegex = /【(\d{4}-\d{2}-\d{2})】/;
    const newDateMatch = post.content.match(newDateRegex);
    
    if (newDateMatch) {
      return newDateMatch[1];
    }
    
    // 旧フォーマットその1: YYYY-MM-DD のトレーニング成果
    const oldDateRegex1 = /(\d{4}-\d{2}-\d{2})のトレーニング成果/;
    const oldDateMatch1 = post.content.match(oldDateRegex1);
    
    if (oldDateMatch1) {
      return oldDateMatch1[1];
    }
    
    // 旧フォーマットその2: 単純なYYYY-MM-DD形式
    const oldDateRegex2 = /(\d{4}-\d{2}-\d{2})/;
    const oldDateMatch2 = post.content.match(oldDateRegex2);
    
    if (oldDateMatch2) {
      return oldDateMatch2[1];
    }
    
    // 投稿内容に日付がない場合は、投稿の作成日を使用
    return new Date(post.created_at).toLocaleDateString('en-CA'); // YYYY-MM-DD形式
  };

  // 投稿内容から日付マーカーと不要なテキストを削除する関数
  const getCleanPostContent = (post) => {
    if (!post || !post.content) return '';
    
    let content = post.content;
    
    // 日付マーカーを削除 (【YYYY-MM-DD】 形式)
    content = content.replace(/【\d{4}-\d{2}-\d{2}】\s*/, '');
    
    return content.trim();
  };

  // カロリー差分を計算する関数
  const calculateCalorieDifference = () => {
    const { consumedCalories, intakeCalories } = achievementData;
    if (consumedCalories && intakeCalories) {
      return consumedCalories.total_calories - intakeCalories.calories;
    }
    return null;
  };

  // 数値を少数第一位で四捨五入して整数として表示するフォーマット関数
  const formatCalories = (value) => {
    if (value === null || value === undefined) return 'データなし';
    
    // 数値を少数第一位で四捨五入し、整数に変換
    const roundedValue = Math.round(value);
    
    // 整数にカンマを挿入
    const formattedValue = roundedValue.toLocaleString();
    
    return `${formattedValue} kcal`;
  };

  // トレーニングのカテゴリーごとにグループ化する関数
  const groupTrainingsByCategory = () => {
    const { trainingData } = achievementData;
    
    // カテゴリーごとのグループを作成
    const groupedByCategory = {};
    
    trainingData.forEach(training => {
      const category = training.category || '未分類';
      if (!groupedByCategory[category]) {
        groupedByCategory[category] = [];
      }
      groupedByCategory[category].push(training);
    });
    
    return groupedByCategory;
  };

  // 種目ごとのトレーニングデータをグループ化する関数
  const groupTrainingsByExercise = (trainings) => {
    const groupByExercise = {};
    
    trainings.forEach(training => {
      const exerciseName = training.workout_name;
      if (!groupByExercise[exerciseName]) {
        groupByExercise[exerciseName] = {
          workout_id: training.workout_id,
          category: training.category,
          is_aerobic: training.is_aerobic,
          sets: []
        };
      }
      
      groupByExercise[exerciseName].sets.push({
        id: training.id,
        setNumber: training.sets,
        weight: training.weight,
        reps: training.reps
      });
    });
    
    // セット順にソート
    Object.values(groupByExercise).forEach(exercise => {
      exercise.sets.sort((a, b) => a.setNumber - b.setNumber);
    });
    
    return groupByExercise;
  };

  // Xでシェアする関数
  const shareOnTwitter = () => {
    if (!post) return;
    
    const cleanContent = getCleanPostContent(post);
    const userName = post.userName || "ユーザー";
    const trainingDate = post.achievementDate || "";
    
    // アプリのベースURL
    const appUrl = "https://diet-maker-mu.vercel.app";
    
    // 詳細ページへのURL
    const recordDetailUrl = `${appUrl}/training-details/${postId}?date=${trainingDate}`;
    
    // 投稿内容があれば追加
    let contentText = "";
    if (cleanContent && cleanContent.trim() !== "") {
      contentText = `\n${cleanContent}`;
    }
    
    // テキスト全体を組み立てる（ハッシュタグを最初に、URLを最後に）
    const fullText = `#ダイエットメーカー

【${trainingDate}のトレーニング記録】${contentText}

トレーニングの記録はこちら👇
${recordDetailUrl}`;
    
    // URLエンコードせずそのままTwitterの共有URLに渡す
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}`, '_blank');
  };

  // 投稿一覧に戻る
  const handleBack = () => {
    navigate('/posts');
  };

  if (loading) return <div className="posts-loading">読み込み中...</div>;
  if (error) return <div className="posts-error">{error}</div>;
  if (!post) return <div className="posts-error">投稿が見つかりません</div>;

  // カテゴリー順序の定義
  const categoryOrder = ['胸', '背中', '肩', '腕', '脚', '腹筋', '有酸素'];
  
  // トレーニングデータのカテゴリーごとのグループ
  const groupedTrainingsByCategory = groupTrainingsByCategory();
  
  // カテゴリー順にソート
  const sortedCategories = Object.keys(groupedTrainingsByCategory).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );

  return (
    <div className="posts-training-record-container">
      {/* 投稿情報 */}
      <div className="posts-post-content-card">
        <div className="posts-post-info">
          <p className="posts-post-date">
            投稿日：{new Date(post.created_at).toLocaleDateString("ja-JP")}
            {post.achievementDate && <span className="posts-training-date"> 【トレーニング日】：{post.achievementDate}</span>}
          </p>
          <p className="posts-post-author">ユーザー名：{post.userName}</p>
        </div>
        <p className="posts-post-content">{getCleanPostContent(post)}</p>
      </div>

      {/* トレーニング記録 */}
      <div className="posts-ach-training-records-container">
        <div className="posts-training-record-title-area">
          <h2 className="posts-training-record-title">トレーニング記録</h2>
        </div>
        
        {achievementData.trainingData.length > 0 ? (
          <div className="posts-ach-training-records-by-category">
            {/* カテゴリー名をリストとして表示 */}
            <div className="posts-ach-category-list">
              {sortedCategories.map(category => (
                <span 
                  key={category} 
                  className={`posts-ach-category-badge ${category === "有酸素" ? 'posts-aerobic' : ''}`}
                >
                  {category}
                </span>
              ))}
            </div>

            {/* トレーニングテーブル */}
            <div className="posts-ach-training-records-table-container">
              <table className="posts-ach-training-records-table">
                <thead>
                  <tr>
                    <th>対象部位</th>
                    <th>種目</th>
                    <th>セット</th>
                    <th>重量OR時間</th>
                    <th>回数</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCategories.map(category => {
                    const categoryTrainings = groupedTrainingsByCategory[category];
                    const exerciseGroups = groupTrainingsByExercise(categoryTrainings);
                    
                    return Object.entries(exerciseGroups).map(([exerciseName, exerciseData], exerciseIndex) => {
                      const isAerobic = exerciseData.is_aerobic;
                      const setsCount = exerciseData.sets.length;
                      
                      return (
                        <React.Fragment key={`exercise-${category}-${exerciseIndex}`}>
                          {exerciseData.sets.map((set, setIndex) => (
                            <tr key={`set-${set.id}`}>
                              {setIndex === 0 ? (
                                <>
                                  <td 
                                    rowSpan={setsCount} 
                                    className={`posts-ach-category-name ${isAerobic ? 'posts-aerobic' : ''}`}
                                  >
                                    {category}
                                  </td>
                                  <td 
                                    rowSpan={setsCount}
                                    className="posts-ach-exercise-name"
                                  >
                                    {exerciseName}
                                  </td>
                                </>
                              ) : null}
                              <td>{set.setNumber}</td>
                              <td>{set.weight}{isAerobic ? '分' : 'kg'}</td>
                              <td>{isAerobic ? '-' : set.reps}</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    });
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="posts-ach-no-data-message">トレーニング記録はありません</p>
        )}
      </div>
      
      {/* カロリー関係の記録 */}
      <div className="posts-daily-stats-container">
        <div className="posts-daily-stats-title-area">
          <h2 className="posts-daily-stats-title">カロリー関係の記録</h2>
        </div>
        <div className="posts-daily-stats-section">
          <div className="posts-daily-stats-grid">
            <div className="posts-daily-stat-item">
              <div className="posts-daily-stat-icon">👣</div>
              <div className="posts-daily-stat-label">歩数</div>
              <div className="posts-daily-stat-value">
                {achievementData.stepData ? `${achievementData.stepData.steps.toLocaleString()} 歩` : 'データなし'}
              </div>
            </div>
            <div className="posts-daily-stat-item">
              <div className="posts-daily-stat-icon">🔥</div>
              <div className="posts-daily-stat-label">消費カロリー</div>
              <div className="posts-daily-stat-value">
                {achievementData.consumedCalories ? formatCalories(achievementData.consumedCalories.total_calories) : 'データなし'}
              </div>
            </div>
            <div className="posts-daily-stat-item">
              <div className="posts-daily-stat-icon">🍖</div>
              <div className="posts-daily-stat-label">摂取カロリー</div>
              <div className="posts-daily-stat-value">
              {achievementData.intakeCalories ? formatCalories(achievementData.intakeCalories.calories) : 'データなし'}
              </div>
            </div>
            <div className="posts-daily-stat-item">
              <div className="posts-daily-stat-icon">⚖️</div>
              <div className="posts-daily-stat-label">カロリー差分</div>
              <div className={`posts-daily-stat-value ${calculateCalorieDifference() > 0 ? 'posts-positive' : calculateCalorieDifference() < 0 ? 'posts-negative' : ''}`}>
                {calculateCalorieDifference() !== null 
                  ? `${calculateCalorieDifference() > 0 ? '+' : ''}${formatCalories(calculateCalorieDifference())}` 
                  : 'データなし'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* シェアボタン */}
      <div className="posts-twitter-share-container">
        <button 
          className="posts-twitter-share-button"
          onClick={shareOnTwitter}
        >
          <i className="posts-twitter-icon">𝕏</i> シェア
        </button>
      </div>
      
      {/* 戻るボタン */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button 
          className="posts-back-button" 
          onClick={handleBack}
          style={{ display: "inline-flex", margin: "0 auto" }}
        >
          ← 投稿一覧に戻る
        </button>
      </div>
    </div>
  );
};

export default TrainingRecordDetail;
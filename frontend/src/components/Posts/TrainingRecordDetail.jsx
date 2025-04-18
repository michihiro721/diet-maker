import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/TrainingRecordDetail.css";
import TrainingCopyModal from "./TrainingCopyModal";
import TrainingCalculatorModal from "./TrainingCalculatorModal";

const api = axios.create({
  baseURL: "https://diet-maker-d07eb3099e56.herokuapp.com"
});

const TrainingRecordDetail = () => {
  const { postId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

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
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    steps: "",
    consumedCalories: "",
    intakeCalories: ""
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const [calculatorModalOpen, setCalculatorModalOpen] = useState(false);
  const [activeField, setActiveField] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId') || null;
    setCurrentUserId(userId ? parseInt(userId, 10) : null);
  }, []);


  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/posts/${postId}`);

        const date = dateParam || getPostDate(response.data);

        setPost({
          ...response.data,
          achievementDate: date,
          userName: response.data.user?.name || "ユーザー"
        });

        await fetchAchievementData(response.data.user_id, date);

      } catch (err) {
        setError(`エラー: ${err.message}. ステータス: ${err.response?.status || 'N/A'}`);
        setLoading(false);
      }
    };

    if (postId) {
      fetchPostData();
    }
  }, [postId, dateParam]);

  const fetchAchievementData = async (userId, date) => {
    try {

      const workoutsResponse = await api.get('/workouts');
      const workoutsData = workoutsResponse.data;

      const trainingResponse = await api.get(`/trainings`, {
        params: {
          user_id: userId,
          date: date
        }
      });

      const stepsResponse = await api.get(`/steps`, {
        params: {
          user_id: userId,
          date: date
        }
      });

      const consumedCaloriesResponse = await api.get(`/daily_calories`, {
        params: {
          user_id: userId,
          date: date
        }
      });

      const intakeCaloriesResponse = await api.get(`/intake_calories`, {
        params: {
          user_id: userId,
          date: date
        }
      });

      const stepData = stepsResponse.data.find(item => item.date === date) || null;
      const consumedCalories = consumedCaloriesResponse.data.find(item => item.date === date) || null;
      const intakeCalories = intakeCaloriesResponse.data.find(item => item.date === date) || null;

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

      const groupedTrainingData = enhancedTrainingData.reduce((groups, training) => {
        const key = `${training.workout_id}-${training.category}`;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(training);
        return groups;
      }, {});

      let sortedTrainingData = [];

      const categories = ['胸', '背中', '肩', '腕', '脚', '腹筋', '有酸素'];

      const categoryGroups = {};
      categories.forEach(category => {
        categoryGroups[category] = [];
      });

      Object.values(groupedTrainingData).forEach(group => {
        const category = group[0].category;
        if (categoryGroups[category]) {
          categoryGroups[category].push(group);
        }
      });

      categories.forEach(category => {
        categoryGroups[category].forEach(group => {

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
        workouts: workoutsData,
        userId: userId
      });


      setEditFormData({
        steps: stepData?.steps || "",
        consumedCalories: consumedCalories?.total_calories || "",
        intakeCalories: intakeCalories?.calories || ""
      });

      setLoading(false);
    } catch (error) {
      setError(`成果データの取得に失敗しました: ${error.message}`);
      setLoading(false);
    }
  };


  const isCurrentUserOwner = () => {
    if (!currentUserId || !achievementData.userId) return false;
    return currentUserId === achievementData.userId;
  };

  const getPostDate = (post) => {
    if (!post || !post.content) return '';

    const newDateRegex = /【(\d{4}-\d{2}-\d{2})】/;
    const newDateMatch = post.content.match(newDateRegex);

    if (newDateMatch) {
      return newDateMatch[1];
    }

    const oldDateRegex1 = /(\d{4}-\d{2}-\d{2})のトレーニング成果/;
    const oldDateMatch1 = post.content.match(oldDateRegex1);

    if (oldDateMatch1) {
      return oldDateMatch1[1];
    }

    const oldDateRegex2 = /(\d{4}-\d{2}-\d{2})/;
    const oldDateMatch2 = post.content.match(oldDateRegex2);

    if (oldDateMatch2) {
      return oldDateMatch2[1];
    }

    return new Date(post.created_at).toLocaleDateString('en-CA');
  };


  const getCleanPostContent = (post) => {
    if (!post || !post.content) return '';

    let content = post.content;

    content = content.replace(/【\d{4}-\d{2}-\d{2}】\s*/, '');

    return content.trim();
  };


  const calculateCalorieDifference = () => {
    const { consumedCalories, intakeCalories } = achievementData;
    if (consumedCalories && intakeCalories) {
      return intakeCalories.calories - consumedCalories.total_calories;
    }
    return null;
  };


  const formatCalories = (value) => {
    if (value === null || value === undefined) return 'データなし';

    const roundedValue = Math.round(value);

    const formattedValue = roundedValue.toLocaleString();

    return `${formattedValue} kcal`;
  };


  const groupTrainingsByCategory = () => {
    const { trainingData } = achievementData;

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

    Object.values(groupByExercise).forEach(exercise => {
      exercise.sets.sort((a, b) => a.setNumber - b.setNumber);
    });

    return groupByExercise;
  };

  const shareOnTwitter = () => {
    if (!post) return;

    const cleanContent = getCleanPostContent(post);
    const trainingDate = post.achievementDate || "";
    const appUrl = "https://diet-maker.jp";


    const recordDetailUrl = `${appUrl}/training-details/${postId}?date=${trainingDate}`;


    let contentText = "";
    if (cleanContent && cleanContent.trim() !== "") {
      contentText = `\n${cleanContent}`;
    }

    const fullText = `#ダイエット #ダイエットメーカー

【${trainingDate}のトレーニング記録】${contentText}

トレーニングの記録はこちら👇
${recordDetailUrl}`;

    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}`, '_blank');
  };


  const handleBack = () => {
    navigate('/posts');
  };


  const toggleEditMode = () => {
    if (!isCurrentUserOwner() && !isEditMode) return;

    if (isEditMode) {
      setEditFormData({
        steps: achievementData.stepData?.steps || "",
        consumedCalories: achievementData.consumedCalories?.total_calories || "",
        intakeCalories: achievementData.intakeCalories?.calories || ""
      });
      setUpdateSuccess(false);
      setUpdateError(null);
    }
    setIsEditMode(!isEditMode);
  };


  const openCalculatorModal = (fieldName) => {
    if (!isEditMode) return;

    setActiveField(fieldName);
    setCalculatorModalOpen(true);
  };


  const handleCalculatorSave = (value) => {
    if (!activeField) return;

    setEditFormData({
      ...editFormData,
      [activeField]: value
    });
  };


  const handleEditFormChange = (e) => {
    const { name, value } = e.target;

    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setEditFormData({
        ...editFormData,
        [name]: value
      });
    }
  };

  const handleUpdateData = async () => {
    if (!isCurrentUserOwner()) {
      setUpdateError("自分の投稿のみ編集できます");
      return;
    }

    if (!post || !post.user_id || !post.achievementDate) return;

    const userId = post.user_id;
    const date = post.achievementDate;

    try {
      setUpdateLoading(true);
      setUpdateError(null);

      if (editFormData.steps !== "") {
        const stepsData = {
          step: {
            user_id: userId,
            date: date,
            steps: parseFloat(editFormData.steps) || 0
          }
        };

        await api.post('/steps', stepsData);
      }

      if (editFormData.consumedCalories !== "") {
        const consumedCaloriesData = {
          daily_calorie: {
            user_id: userId,
            date: date,
            total_calories: parseFloat(editFormData.consumedCalories) || 0
          }
        };

        await api.post('/daily_calories', consumedCaloriesData);
      }

      if (editFormData.intakeCalories !== "") {
        const intakeCaloriesData = {
          intake_calorie: {
            user_id: userId,
            date: date,
            calories: parseFloat(editFormData.intakeCalories) || 0
          }
        };

        await api.post('/intake_calories', intakeCaloriesData);
      }

      await fetchAchievementData(userId, date);

      setUpdateSuccess(true);
      setUpdateLoading(false);

      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);

      setIsEditMode(false);

    } catch (error) {
      setUpdateError(`データの更新に失敗しました: ${error.message}. ステータス: ${error.response?.status || 'N/A'}`);
      setUpdateLoading(false);
    }
  };

  if (loading) return <div className="posts-loading">読み込み中...</div>;
  if (error) return <div className="posts-error">{error}</div>;
  if (!post) return <div className="posts-error">投稿が見つかりません</div>;

  const categoryOrder = ['胸', '背中', '肩', '腕', '脚', '腹筋', '有酸素'];

  const groupedTrainingsByCategory = groupTrainingsByCategory();

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

      {achievementData.trainingData.length > 0 && (
        <div className="training-copy-container">
          <button 
            className="training-copy-button"
            onClick={() => setIsCopyModalOpen(true)}
          >
            トレーニングメニューをコピー
          </button>
        </div>
      )}

      {/* トレーニング記録 */}
      <div className="posts-ach-training-records-container">
        <div className="posts-training-record-title-area">
          <h2 className="posts-training-record-title">トレーニング記録</h2>
        </div>
        {achievementData.trainingData.length > 0 ? (
          <div className="posts-ach-training-records-by-category">
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

          {isCurrentUserOwner() && (
            <button
              className={`posts-daily-stats-edit-button ${isEditMode ? 'active' : ''}`}
              onClick={toggleEditMode}
            >
              {isEditMode ? 'キャンセル' : '編集'}
            </button>
          )}
        </div>

        {/* 編集モード */}
        {isEditMode && isCurrentUserOwner() ? (
          <div className="posts-daily-stats-edit-form">
            <div className="posts-daily-stats-edit-row">
              <div className="posts-daily-stats-edit-field">
                <label htmlFor="steps">歩数</label>
                <div className="posts-daily-stats-edit-input-group">
                  <input
                    type="text"
                    id="steps"
                    name="steps"
                    value={editFormData.steps}
                    onChange={handleEditFormChange}
                    placeholder="歩数を入力"
                    onClick={() => openCalculatorModal('steps')}
                    readOnly
                  />
                  <span className="posts-daily-stats-edit-unit">歩</span>
                </div>
              </div>

              <div className="posts-daily-stats-edit-field">
                <label htmlFor="consumedCalories">消費カロリー</label>
                <div className="posts-daily-stats-edit-input-group">
                  <input
                    type="text"
                    id="consumedCalories"
                    name="consumedCalories"
                    value={editFormData.consumedCalories}
                    onChange={handleEditFormChange}
                    placeholder="消費カロリーを入力"
                    onClick={() => openCalculatorModal('consumedCalories')}
                    readOnly
                  />
                  <span className="posts-daily-stats-edit-unit">kcal</span>
                </div>
              </div>

              <div className="posts-daily-stats-edit-field">
                <label htmlFor="intakeCalories">摂取カロリー</label>
                <div className="posts-daily-stats-edit-input-group">
                  <input
                    type="text"
                    id="intakeCalories"
                    name="intakeCalories"
                    value={editFormData.intakeCalories}
                    onChange={handleEditFormChange}
                    placeholder="摂取カロリーを入力"
                    onClick={() => openCalculatorModal('intakeCalories')}
                    readOnly
                  />
                  <span className="posts-daily-stats-edit-unit">kcal</span>
                </div>
              </div>
            </div>

            <div className="posts-daily-stats-edit-actions">
              <button
                className="posts-daily-stats-save-button"
                onClick={handleUpdateData}
                disabled={updateLoading}
              >
                {updateLoading ? '保存中...' : '保存する'}
              </button>
            </div>

            {updateError && (
              <div className="posts-daily-stats-update-error">
                {updateError}
              </div>
            )}
          </div>
        ) : (
          <div className="posts-daily-stats-section">
            {updateSuccess && (
              <div className="posts-daily-stats-update-success">
                データを更新しました！
              </div>
            )}

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
        )}
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

      {/* トレーニングコピー */}
      <TrainingCopyModal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        trainingData={achievementData.trainingData}
        userId={post.user_id}
      />
      <TrainingCalculatorModal
        isOpen={calculatorModalOpen}
        onClose={() => setCalculatorModalOpen(false)}
        onSave={handleCalculatorSave}
        initialValue={activeField ? editFormData[activeField] : ""}
      />
    </div>
  );
};

export default TrainingRecordDetail;
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/Posts.css";

const api = axios.create({
  baseURL: "https://diet-maker-d07eb3099e56.herokuapp.com"
});

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [likesCount, setLikesCount] = useState({});
  const [totalLikesCount, setTotalLikesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [selectedAchievementPost, setSelectedAchievementPost] = useState(null);
  const [achievementData, setAchievementData] = useState({
    trainingData: [],
    stepData: null,
    consumedCalories: null,
    intakeCalories: null,
    workouts: []
  });
  const [achievementLoading, setAchievementLoading] = useState(false);
  
  const postsPerPage = 6;

  // ログイン状態の確認
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const jwt = localStorage.getItem('jwt');
    
    setUserId(storedUserId ? Number(storedUserId) : null);
    setIsLoggedIn(!!storedUserId && !!jwt);
    
    console.log('認証情報:', { userId: storedUserId, jwt: jwt ? '取得済み' : 'なし' });
  }, []);

  // 投稿データの取得
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("投稿データを取得中...");
        setLoading(true);
        
        const response = await api.get("/posts");
        console.log("取得したデータ:", response.data);
        setPosts(response.data);
        
        // いいね数の初期設定
        const initialLikesCount = {};
        response.data.forEach(post => {
          initialLikesCount[post.id] = post.likes?.length || 0;
        });
        setLikesCount(initialLikesCount);
        
        setLoading(false);
      } catch (err) {
        console.error("投稿の取得に失敗しました", err);
        console.error("エラー詳細:", {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          headers: err.response?.headers
        });
        setError(`エラー: ${err.message}. ステータス: ${err.response?.status || 'N/A'}`);
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  // いいねの合計を計算するための useEffect
  useEffect(() => {
    const calculateTotalLikes = () => {
      // ログインしていない場合は0を表示
      if (!isLoggedIn || !userId) {
        setTotalLikesCount(0);
        return;
      }
      
      // ユーザーIDを数値に変換
      const userIdNum = Number(userId);
      
      // 自分の投稿のみ抽出（直接投稿のuser_idと比較）
      const myPosts = posts.filter(post => post.user_id === userIdNum);
      
      // 自分の投稿に対するいいね数を合計
      let total = 0;
      myPosts.forEach(post => {
        total += post.likes?.length || 0;
      });
      
      console.log('いいね数計算:', {
        userIdNum,
        myPostsCount: myPosts.length,
        myPostIds: myPosts.map(p => p.id),
        allPostUserIds: posts.map(p => p.user_id),
        postUserProperties: posts.map(p => Object.keys(p)),
        likesOnMyPosts: myPosts.map(p => p.likes?.length || 0),
        totalLikes: total
      });
      
      setTotalLikesCount(total);
    };
    
    calculateTotalLikes();
  }, [posts, isLoggedIn, userId]);
  
  // 投稿を削除する関数
  const handleDeletePost = async (postId, e) => {
    // イベント伝播を停止（もし引数にイベントがある場合）
    if (e) e.stopPropagation();
    
    if (!isLoggedIn) {
      alert("ログインが必要です");
      return;
    }
    
    // 削除確認
    if (!window.confirm("この投稿を削除してもよろしいですか？")) {
      return;
    }
    
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      // トークンを取得
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        alert("認証情報が見つかりません。再ログインしてください。");
        setIsDeleting(false);
        return;
      }
      
      const config = {
        headers: { 'Authorization': `Bearer ${jwt}` }
      };
      
      // 削除リクエスト送信
      await api.delete(`/posts/${postId}`, config);
      
      // 投稿リストから削除した投稿を除外
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      
      console.log(`投稿ID ${postId} を削除しました`);
      setIsDeleting(false);
      
    } catch (err) {
      console.error("投稿の削除に失敗しました", err);
      
      setDeleteError(`削除に失敗しました: ${err.response?.data?.error || err.message}`);
      setIsDeleting(false);
      
      if (err.response?.status === 401) {
        alert("認証が切れました。再ログインしてください。");
      } else if (err.response?.status === 403) {
        alert("この投稿を削除する権限がありません。");
      } else {
        alert(`削除に失敗しました: ${err.message}`);
      }
    }
  };

  // 投稿日付から実際の日付文字列を取得する関数
  const getPostDate = (post) => {
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

  // 成果を表示する関数
  const handleViewAchievement = async (post, e) => {
    // イベント伝播を停止（もし引数にイベントがある場合）
    if (e) e.stopPropagation();
    
    // 投稿日付を取得
    const achievementDate = getPostDate(post);
    const postUserId = post.user_id;
    const userName = post.user?.name || "ユーザー";

    setSelectedAchievementPost({
      ...post,
      achievementDate,
      userName
    });
    setAchievementLoading(true);

    try {
      // 全種目データを取得
      const workoutsResponse = await api.get('/workouts');
      const workoutsData = workoutsResponse.data;
      
      // トレーニングデータを取得
      const trainingResponse = await api.get(`/trainings`, {
        params: { 
          user_id: postUserId,
          date: achievementDate
        }
      });
      
      // 歩数データを取得
      const stepsResponse = await api.get(`/steps`, {
        params: { 
          user_id: postUserId,
          date: achievementDate
        }
      });
      
      // 消費カロリーデータを取得
      const consumedCaloriesResponse = await api.get(`/daily_calories`, {
        params: {
          user_id: postUserId,
          date: achievementDate
        }
      });
      
      // 摂取カロリーデータを取得
      const intakeCaloriesResponse = await api.get(`/intake_calories`, {
        params: { 
          user_id: postUserId,
          date: achievementDate
        }
      });

      // データをフィルタリング（選択した日付のデータのみ）
      const stepData = stepsResponse.data.find(item => item.date === achievementDate) || null;
      const consumedCalories = consumedCaloriesResponse.data.find(item => item.date === achievementDate) || null;
      const intakeCalories = intakeCaloriesResponse.data.find(item => item.date === achievementDate) || null;

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
        date: achievementDate,
        workouts: workoutsData
      });
      
    } catch (error) {
      console.error("成果データの取得に失敗しました:", error);
      alert("成果データの取得に失敗しました。");
    } finally {
      setAchievementLoading(false);
    }
  };

  // 成果モーダルを閉じる
  const closeAchievementModal = () => {
    setSelectedAchievementPost(null);
    setAchievementData({
      trainingData: [],
      stepData: null,
      consumedCalories: null,
      intakeCalories: null,
      workouts: []
    });
  };
  
  // いいね機能の処理
  const handleLike = async (postId, e) => {
    // イベント伝播を停止（もし引数にイベントがある場合）
    if (e) e.stopPropagation();
    
    if (!isLoggedIn) {
      alert("いいねするにはログインが必要です");
      window.location.href = '/login'; // ログインページへリダイレクト
      return;
    }
    
    try {
      console.log("いいねリクエスト送信中...");
      
      // トークンを取得
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        alert("認証情報が見つかりません。再ログインしてください。");
        return;
      }
      
      const config = {
        headers: { 'Authorization': `Bearer ${jwt}` }
      };
      
      // リクエスト送信
      const response = await api.post(`/posts/${postId}/likes`, {}, config);
      console.log("いいねレスポンス:", response.data);
      
      // レスポンスデータから必要な情報を取得
      const liked = response.data.liked;
      const likesCount = response.data.likes_count || 0;
      const userIdNum = Number(userId);
      
      // 投稿の状態を更新
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            let updatedLikes;
            
            // いいねの状態によって処理を分ける
            if (liked) {
              // いいねが追加された場合
              updatedLikes = [...(post.likes || []), { user_id: userIdNum }];
            } else {
              // いいねが削除された場合
              updatedLikes = (post.likes || []).filter(like => like.user_id !== userIdNum);
            }
            
            // 投稿を更新
            return {
              ...post,
              likes: updatedLikes
            };
          }
          return post;
        })
      );
      
      // 個別投稿のいいね数を更新
      setLikesCount(prev => ({
        ...prev,
        [postId]: likesCount
      }));
      
    } catch (err) {
      console.error("いいねの処理に失敗しました", err);
      console.error("エラーの詳細:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      
      if (err.response?.status === 401) {
        alert("認証が切れました。再ログインしてください。");
      } else {
        alert(`いいねの処理に失敗しました: ${err.message}`);
      }
    }
  };

  // 検索機能
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 検索時は1ページ目に戻す
  };
  
  // フィルタリングされた投稿
  const filteredPosts = posts.filter(post => {
    // userがundefinedの場合も考慮
    const userName = post.user?.name || '';
    return userName.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // ページネーション
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  
  // ページ変更ハンドラー
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  
  // ページネーションの表示範囲を計算する
  const getPaginationRange = () => {
    // 表示数の制限 (スマホの場合はさらに少なくなる)
    const isSmallScreen = window.innerWidth < 768;
    const maxDisplayCount = isSmallScreen ? 5 : 9;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxDisplayCount / 2));
    let endPage = Math.min(totalPages, startPage + maxDisplayCount - 1);
    
    // startPageの調整（endPageが最大値に達している場合）
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxDisplayCount + 1);
    }
    
    // 範囲を配列として返す
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };
  
  // ユーザーが投稿にいいねしているかチェック
  const hasUserLiked = (post) => {
    if (!isLoggedIn || !userId) return false;
    const userIdNum = Number(userId);
    return post.likes?.some(like => like.user_id === userIdNum);
  };

  // 自分の投稿かどうかをチェック
  const isMyPost = (post) => {
    if (!isLoggedIn || !userId) return false;
    return post.user_id === Number(userId);
  };

  // すべての投稿にトレーニング記録ボタンを表示するためにtrueを返す
  const hasAchievementData = (post) => {
    return true;
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

  if (loading) return <div className="loading">読み込み中...</div>;
  if (error) return <div className="error">{error}</div>;
  
  // ページネーションの表示範囲
  const paginationRange = getPaginationRange();
  
  // カテゴリー順序の定義
  const categoryOrder = ['胸', '背中', '肩', '腕', '脚', '腹筋', '有酸素'];
  
  // トレーニングデータのカテゴリーごとのグループ
  const groupedTrainingsByCategory = groupTrainingsByCategory();
  
  // カテゴリー順にソート
  const sortedCategories = Object.keys(groupedTrainingsByCategory).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );
  
  return (
    <div className="posts-container">
      <div className="search-container-centered">
        <div className="search-box">
          <input
            type="text"
            placeholder="ユーザー名で検索"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <button className="search-button">検索</button>
        </div>

        <div className="heart-count">
          ❤️をもらった累計数：{totalLikesCount}
        </div>
      </div>
      
      {deleteError && (
        <div className="delete-error">{deleteError}</div>
      )}
      
      {/* 投稿一覧 */}
      {posts.length === 0 ? (
        <p className="no-posts">投稿がありません</p>
      ) : (
        <div className="posts-grid">
          {currentPosts.map(post => (
            <div key={post.id} className="post-card">
              {/* 自分の投稿の場合は削除ボタンを表示 */}
              {isMyPost(post) && (
                <button 
                  className="delete-post-button"
                  onClick={(e) => handleDeletePost(post.id, e)}
                  disabled={isDeleting}
                  title="投稿を削除"
                >
                  ×
                </button>
              )}

              {/* トレーニング記録ボタンを上部中央に配置 */}
              {hasAchievementData(post) && (
                <div className="training-record-button-container">
                  <button 
                    className="view-achievement-button"
                    onClick={(e) => handleViewAchievement(post, e)}
                    title="トレーニング記録を見る"
                  >
                    トレーニング記録
                  </button>
                </div>
              )}

              <div className="post-info">
                <p className="post-date">
                  投稿日：{new Date(post.created_at).toLocaleDateString("ja-JP")}
                  {getPostDate(post) && <span className="training-date"> 【トレーニング日】：{getPostDate(post)}</span>}
                </p>
                <p className="post-author">ユーザー名：{post.user?.name || "不明なユーザー"}</p>
              </div>
              
              <p className="post-content">{getCleanPostContent(post)}</p>
              
              <button 
                className={`like-button ${hasUserLiked(post) ? 'liked' : ''}`}
                onClick={(e) => handleLike(post.id, e)}
              >
                {hasUserLiked(post) ? '❤️' : '♡'}
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* 成果モーダル */}
      {selectedAchievementPost && (
        <div className="achievement-modal-overlay" onClick={closeAchievementModal}>
          <div className="achievement-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-button" onClick={closeAchievementModal}>×</button>
            
            <div className="achievement-modal-content">
              <h2 className="achievement-modal-title">
                {selectedAchievementPost.userName}さんの
                {achievementData.date} の成果
              </h2>
              
              {achievementLoading ? (
                <div className="achievement-loading">成果データを読み込み中...</div>
              ) : (
                <>
                  {/* トレーニング記録 */}
                  <div className="ach-training-records-container">
                    <h2 className="ach-training-records-title">トレーニング記録</h2>
                    
                    {achievementData.trainingData.length > 0 ? (
                      <div className="ach-training-records-by-category">
                        {/* カテゴリー名をリストとして表示 */}
                        <div className="ach-category-list">
                          {sortedCategories.map(category => (
                            <span 
                              key={category} 
                              className={`ach-category-badge ${category === "有酸素" ? 'aerobic' : ''}`}
                            >
                              {category}
                            </span>
                          ))}
                        </div>

                        {/* すべてのトレーニングを一つのテーブルにまとめる */}
                        <div className="ach-training-records-table-container">
                          <table className="ach-training-records-table">
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
                                      {/* 各セットを別々の行で表示 */}
                                      {exerciseData.sets.map((set, setIndex) => (
                                        <tr key={`set-${set.id}`} className={setIndex === 0 ? 'ach-exercise-first-row' : ''}>
                                          {/* 最初のセットの場合のみカテゴリー名と種目名を表示して行を結合 */}
                                          {setIndex === 0 ? (
                                            <>
                                              <td 
                                                rowSpan={setsCount} 
                                                className={`ach-category-name ${isAerobic ? 'aerobic' : ''}`}
                                              >
                                                {category}
                                              </td>
                                              <td 
                                                rowSpan={setsCount} 
                                                className={`ach-exercise-name ${isAerobic ? 'aerobic' : ''}`}
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
                      <p className="ach-no-data-message">トレーニング記録はありません</p>
                    )}
                  </div>
                  
                  {/* カロリー関係の記録 */}
                  <div className="daily-stats-container">
                    <h2 className="daily-stats-title">カロリー関係の記録</h2>
                    <div className="daily-stats-section">
                      <div className="daily-stats-grid">
                        <div className="daily-stat-item">
                          <div className="daily-stat-label">歩数</div>
                          <div className="daily-stat-value">
                            {achievementData.stepData ? `${achievementData.stepData.steps.toLocaleString()} 歩` : 'データなし'}
                          </div>
                        </div>
                        <div className="daily-stat-item">
                          <div className="daily-stat-label">消費カロリー</div>
                          <div className="daily-stat-value">
                            {achievementData.consumedCalories ? formatCalories(achievementData.consumedCalories.total_calories) : 'データなし'}
                          </div>
                        </div>
                        <div className="daily-stat-item">
                          <div className="daily-stat-label">摂取カロリー</div>
                          <div className="daily-stat-value">
                          {achievementData.intakeCalories ? formatCalories(achievementData.intakeCalories.calories) : 'データなし'}
                          </div>
                        </div>
                        <div className="daily-stat-item">
                          <div className="daily-stat-label">カロリー差分</div>
                          <div className={`daily-stat-value ${calculateCalorieDifference() > 0 ? 'positive' : calculateCalorieDifference() < 0 ? 'negative' : ''}`}>
                            {calculateCalorieDifference() !== null 
                              ? `${calculateCalorieDifference() > 0 ? '+' : ''}${formatCalories(calculateCalorieDifference())}` 
                              : 'データなし'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="pagination">
          {/* 最初のページへ */}
          {currentPage > 3 && (
            <button 
              onClick={() => handlePageChange(1)}
              className="pagination-arrow pagination-end"
              title="最初のページへ"
            >
              «
            </button>
          )}
          
          {/* 前のページへ */}
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className="pagination-arrow"
            title="前のページへ"
          >
            ◀
          </button>
          
          {/* ページ番号 */}
          {paginationRange.map(pageNumber => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
            >
              {pageNumber}
            </button>
          ))}
          
          {/* 次のページへ */}
          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="pagination-arrow"
            title="次のページへ"
          >
            ▶
          </button>
          
          {/* 最後のページへ */}
          {currentPage < totalPages - 2 && totalPages > 5 && (
            <button 
              onClick={() => handlePageChange(totalPages)}
              className="pagination-arrow pagination-end"
              title="最後のページへ"
            >
              »
            </button>
          )}
          
          {/* ページ表示情報 */}
          <div className="pagination-info">
            {currentPage} / {totalPages}
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/DailyStats.css";

const DailyStats = ({ userId, selectedDate }) => {
  const [stepData, setStepData] = useState(null);
  const [consumedCalories, setConsumedCalories] = useState(null);
  const [intakeCalories, setIntakeCalories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  // 日付が変わったらデータをリセットする
  useEffect(() => {
    setStepData(null);
    setConsumedCalories(null);
    setIntakeCalories(null);
    setLoading(true);
    setError("");
  }, [selectedDate]);

  // 選択した日付の歩数データを取得
  useEffect(() => {
    const fetchStepData = async () => {
      if (!userId || !selectedDate) {
        setStepData(null);
        return;
      }

      try {
        const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://diet-maker-d07eb3099e56.herokuapp.com';
        const response = await axios.get(`${apiUrl}/steps`, {
          params: { 
            user_id: userId,
            date: selectedDate
          }
        });
        
        console.log(`Steps data for ${selectedDate}:`, response.data);
        
        // APIがすべての日付のデータを返している場合は、選択した日付のデータをフィルタリングする
        if (response.data && response.data.length > 0) {
          // 選択した日付のデータのみをフィルタリング
          const filteredData = response.data.filter(item => item.date === selectedDate);
          
          if (filteredData.length > 0) {
            setStepData(filteredData[0]);
          } else {
            setStepData(null);
          }
        } else {
          setStepData(null);
        }
        setError("");
      } catch (error) {
        console.error(`Error fetching step data for ${selectedDate}:`, error);
        setStepData(null);
      }
    };

    if (userId && selectedDate) {
      fetchStepData();
    }
  }, [userId, selectedDate]);

  // 選択した日付の消費カロリーデータを取得
  useEffect(() => {
    const fetchConsumedCalories = async () => {
      if (!userId || !selectedDate) {
        setConsumedCalories(null);
        return;
      }

      try {
        const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://diet-maker-d07eb3099e56.herokuapp.com';
        const response = await axios.get(`${apiUrl}/daily_calories`, {
          params: {
            user_id: userId,
            date: selectedDate
          }
        });
        
        console.log(`Daily calories data for ${selectedDate}:`, response.data);
        
        // APIがすべての日付のデータを返している場合は、選択した日付のデータをフィルタリングする
        if (response.data && response.data.length > 0) {
          // 選択した日付のデータのみをフィルタリング
          const filteredData = response.data.filter(item => item.date === selectedDate);
          
          if (filteredData.length > 0) {
            setConsumedCalories(filteredData[0]);
          } else {
            setConsumedCalories(null);
          }
        } else {
          setConsumedCalories(null);
        }
      } catch (error) {
        console.error(`Error fetching consumed calories data for ${selectedDate}:`, error);
        setConsumedCalories(null);
      }
    };

    if (userId && selectedDate) {
      fetchConsumedCalories();
    }
  }, [userId, selectedDate]);

  // 選択した日付の摂取カロリーデータを取得
  useEffect(() => {
    const fetchIntakeCalories = async () => {
      if (!userId || !selectedDate) {
        setIntakeCalories(null);
        setLoading(false);
        return;
      }

      try {
        const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://diet-maker-d07eb3099e56.herokuapp.com';
        const response = await axios.get(`${apiUrl}/intake_calories`, {
          params: { 
            user_id: userId,
            date: selectedDate
          }
        });
        
        console.log(`Intake calories data for ${selectedDate}:`, response.data);

        if (response.data && response.data.length > 0) {
          // 選択した日付のデータのみをフィルタリング
          const filteredData = response.data.filter(item => item.date === selectedDate);
          
          if (filteredData.length > 0) {
            setIntakeCalories(filteredData[0]);
          } else {
            setIntakeCalories(null);
          }
        } else {
          setIntakeCalories(null);
        }
      } catch (error) {
        console.error(`Error fetching intake calories data for ${selectedDate}:`, error);
        setIntakeCalories(null);
      } finally {
        setLoading(false);
      }
    };

    if (userId && selectedDate) {
      fetchIntakeCalories();
    } else {
      setLoading(false);
    }
  }, [userId, selectedDate]);

  // カロリー差分を計算する関数
  const calculateCalorieDifference = () => {
    if (consumedCalories && intakeCalories) {
      // 消費カロリー - 摂取カロリー
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

  // シェアモーダルを開く
  const openShareModal = () => {
    // 投稿内容の初期値を設定
    let initialContent = `${selectedDate}のトレーニング成果\n`;
    
    if (stepData) {
      initialContent += `歩数: ${stepData.steps.toLocaleString()} 歩\n`;
    }
    
    if (consumedCalories) {
      initialContent += `消費カロリー: ${formatCalories(consumedCalories.total_calories)}\n`;
    }
    
    if (intakeCalories) {
      initialContent += `摂取カロリー: ${formatCalories(intakeCalories.calories)}\n`;
    }
    
    const calorieDiff = calculateCalorieDifference();
    if (calorieDiff !== null) {
      initialContent += `カロリー差分: ${calorieDiff > 0 ? '+' : ''}${formatCalories(calorieDiff)}`;
    }
    
    setPostContent(initialContent);
    setIsShareModalOpen(true);
  };

  // モーダルを閉じる
  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setPostContent("");
    setPostSuccess(false);
  };

  // 投稿を送信
  const handleSubmitPost = async () => {
    if (!userId || !postContent) {
      alert("投稿内容を入力してください");
      return;
    }

    try {
      setIsPosting(true);
      
      // トークンを取得
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        alert("認証情報が見つかりません。再ログインしてください。");
        setIsPosting(false);
        return;
      }
      
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://diet-maker-d07eb3099e56.herokuapp.com';
      const response = await axios.post(`${apiUrl}/posts`, {
        post: {
          content: postContent
        }
      }, {
        headers: { 'Authorization': `Bearer ${jwt}` }
      });
      
      console.log("投稿成功:", response.data);
      setIsPosting(false);
      setPostSuccess(true);
      
      // 3秒後にモーダルを閉じる
      setTimeout(() => {
        closeShareModal();
      }, 3000);
      
    } catch (error) {
      console.error("投稿に失敗しました:", error);
      setIsPosting(false);
      alert(`投稿に失敗しました: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="daily-stats-container">
      <h2 className="daily-stats-title">カロリー関係の記録</h2>
      {loading ? (
        <div className="daily-stats-loading">データを読み込み中...</div>
      ) : (
        <>
          <div className="daily-stats-section">
            <div className="daily-stats-grid">
              <div className="daily-stat-item">
                <div className="daily-stat-label">歩数</div>
                <div className="daily-stat-value">
                  {stepData ? `${stepData.steps.toLocaleString()} 歩` : 'データなし'}
                </div>
              </div>
              <div className="daily-stat-item">
                <div className="daily-stat-label">消費カロリー</div>
                <div className="daily-stat-value">
                  {consumedCalories ? formatCalories(consumedCalories.total_calories) : 'データなし'}
                </div>
              </div>
              <div className="daily-stat-item">
                <div className="daily-stat-label">摂取カロリー</div>
                <div className="daily-stat-value">
                  {intakeCalories ? formatCalories(intakeCalories.calories) : 'データなし'}
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
          
          {/* シェアボタン */}
          <div className="share-button-container">
            <button 
              className="share-button"
              onClick={openShareModal}
              disabled={loading}
            >
              アプリ内で成果をシェア
            </button>
          </div>
        </>
      )}

      {/* 投稿モーダル */}
      {isShareModalOpen && (
        <div className="share-modal-overlay" onClick={closeShareModal}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-button" onClick={closeShareModal}>×</button>
            <h2>トレーニング成果をシェア</h2>
            
            <div className="share-form">
              <div className="share-form-group">
                <label htmlFor="post-content">投稿内容</label>
                <textarea
                  id="post-content"
                  placeholder="投稿内容"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="share-form-textarea"
                  rows={6}
                />
              </div>
              
              <button 
                className="share-submit-button"
                onClick={handleSubmitPost}
                disabled={isPosting || !postContent}
              >
                {isPosting ? '投稿中...' : '投稿'}
              </button>
              
              {postSuccess && (
                <div className="share-success-message">
                  投稿が完了しました！
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyStats;
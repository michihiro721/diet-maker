import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import axios from "axios";
import "./styles/DailyStats.css";

const DailyStats = ({ userId, selectedDate }) => {
  const [stepData, setStepData] = useState(null);
  const [consumedCalories, setConsumedCalories] = useState(null);
  const [intakeCalories, setIntakeCalories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [trainingData, setTrainingData] = useState([]);

  useEffect(() => {
    setStepData(null);
    setConsumedCalories(null);
    setIntakeCalories(null);
    setTrainingData([]);
    setLoading(true);
  }, [selectedDate]);

  useEffect(() => {
    const fetchTrainingData = async () => {
      if (!userId || !selectedDate) return;

      try {
        const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://diet-maker-d07eb3099e56.herokuapp.com';
        const response = await axios.get(`${apiUrl}/trainings`, {
          params: {
            user_id: userId,
            date: selectedDate
          }
        });
        
        setTrainingData(response.data);
      } catch (error) {
      }
    };
    if (userId && selectedDate) {
      fetchTrainingData();
    }
  }, [userId, selectedDate]);

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

        if (response.data && response.data.length > 0) {
          const filteredData = response.data.filter(item => item.date === selectedDate);

          if (filteredData.length > 0) {
            setStepData(filteredData[0]);
          } else {
            setStepData(null);
          }
        } else {
          setStepData(null);
        }
      } catch (error) {
        setStepData(null);
      }
    };

    if (userId && selectedDate) {
      fetchStepData();
    }
  }, [userId, selectedDate]);

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

        if (response.data && response.data.length > 0) {
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
        setConsumedCalories(null);
      }
    };

    if (userId && selectedDate) {
      fetchConsumedCalories();
    }
  }, [userId, selectedDate]);

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

        if (response.data && response.data.length > 0) {
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

  const calculateCalorieDifference = () => {
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


  const openShareModal = () => {
    setPostContent("");
    setIsShareModalOpen(true);
  };


  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setPostContent("");
    setPostSuccess(false);
  };

  const handleSubmitPost = async () => {
    if (!userId) {
      alert("ログインが必要です");
      return;
    }

    try {
      setIsPosting(true);


      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        alert("認証情報が見つかりません。再ログインしてください。");
        setIsPosting(false);
        return;
      }

      let finalContent = `【${selectedDate}】 ${postContent.trim()}`;

      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://diet-maker-d07eb3099e56.herokuapp.com';
      const response = await axios.post(`${apiUrl}/posts`, {
        post: {
          content: finalContent
        }
      }, {
        headers: { 'Authorization': `Bearer ${jwt}` }
      });

      setIsPosting(false);
      setPostSuccess(true);

      setTimeout(() => {
        closeShareModal();
      }, 3000);

    } catch (error) {
      setIsPosting(false);
      alert(`投稿に失敗しました: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="daily-stats-container" style={{position: 'relative', zIndex: 10}}>
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

          {/* シェアボタン Safari対応のために記載 */}
          <div style={{
            marginTop: '20px',
            textAlign: 'center',
            position: 'relative',
            zIndex: 100,
            display: 'block',
            width: '100%'
          }}>
            <div
              onClick={openShareModal}
              role="button"
              tabIndex={0}
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                backgroundColor: '#4a7dff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
                minWidth: '200px',
                WebkitAppearance: 'none',
                appearance: 'none',
                userSelect: 'none',
                visibility: 'visible',
                opacity: 1
              }}
            >
              アプリ内で成果をシェア
            </div>
          </div>
        </>
      )}

      {/* 投稿モーダル */}
      {isShareModalOpen && (
        <div className="share-modal-overlay" onClick={closeShareModal}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-button" onClick={closeShareModal} type="button">×</button>
            <h2>{selectedDate} のトレーニング成果をシェア</h2>

            <div className="share-form">
              <div className="share-data-summary">
                {trainingData.length > 0 && (
                  <div className="share-data-item full-width">
                    <span className="share-data-label">トレーニング</span>
                    <span className="share-data-value training-count">{trainingData.length}件のトレーニング記録</span>
                  </div>
                )}
                <div className="share-data-item">
                  <span className="share-data-label">歩数</span>
                  <span className="share-data-value">{stepData ? `${stepData.steps.toLocaleString()} 歩` : 'データなし'}</span>
                </div>
                <div className="share-data-item">
                  <span className="share-data-label">消費カロリー</span>
                  <span className="share-data-value">{consumedCalories ? formatCalories(consumedCalories.total_calories) : 'データなし'}</span>
                </div>
                <div className="share-data-item">
                  <span className="share-data-label">摂取カロリー</span>
                  <span className="share-data-value">{intakeCalories ? formatCalories(intakeCalories.calories) : 'データなし'}</span>
                </div>
                {calculateCalorieDifference() !== null && (
                  <div className="share-data-item">
                    <span className="share-data-label">カロリー差分</span>
                    <span className={`share-data-value ${calculateCalorieDifference() > 0 ? 'positive' : calculateCalorieDifference() < 0 ? 'negative' : ''}`}>
                      {`${calculateCalorieDifference() > 0 ? '+' : ''}${formatCalories(calculateCalorieDifference())}`}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="share-form-group">
                <label htmlFor="post-content">コメント (任意)</label>
                <textarea
                  id="post-content"
                  placeholder="感想や目標などをご記入ください（省略可能）"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="share-form-textarea"
                  rows={4}
                />
                <div className="share-form-note">※選択した日付のトレーニング記録が自動的に含まれます</div>
              </div>
              
              {/* シェアボタンモーダル Safari対応のために記載 */}
              <div
                onClick={!isPosting ? handleSubmitPost : undefined}
                role="button"
                tabIndex={0}
                style={{
                  display: 'inline-block',
                  backgroundColor: isPosting ? '#a0aec0' : '#4a7dff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 0',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: isPosting ? 'not-allowed' : 'pointer',
                  width: '90%',
                  maxWidth: '300px',
                  marginTop: '10px',
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  userSelect: 'none',
                  textAlign: 'center'
                }}
              >
                {isPosting ? '投稿中...' : '投稿'}
              </div>
              
              {postSuccess && (
                <div className="share-success-message">
                  {alert('投稿が完了しました！')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


DailyStats.propTypes = {
  userId: PropTypes.string.isRequired,
  selectedDate: PropTypes.string.isRequired
};

export default DailyStats;
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://diet-maker-d07eb3099e56.herokuapp.com';

const OAuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // URLからトークンを取得
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (!token) {
          setError('トークンが見つかりません');
          setLoading(false);
          return;
        }

        // トークンを保存
        localStorage.setItem('jwt', token);
        
        // トークンを使ってユーザー情報を取得
        const response = await axios.get(`${API_BASE_URL}/users/show`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data) {
          // ユーザーIDを保存
          localStorage.setItem('userId', response.data.id);
          
          // ホームページにリダイレクト
          navigate('/', { replace: true });
        } else {
          setError('ユーザー情報の取得に失敗しました');
        }
      } catch (err) {
        console.error('認証エラー:', err);
        setError('認証処理中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [location, navigate]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <h2>認証処理中...</h2>
        <p>しばらくお待ちください</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <h2>エラーが発生しました</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/login')}>
          ログイン画面に戻る
        </button>
      </div>
    );
  }

  return null;
};

export default OAuthCallback;
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// 環境に応じたAPIベースURL
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000' 
  : 'https://diet-maker-d07eb3099e56.herokuapp.com';

const OAuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // URLからトークンとユーザーIDを取得
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userId = params.get('user_id');
        
        if (!token) {
          setError('トークンが見つかりません');
          setLoading(false);
          return;
        }

        console.log('Received token:', token);
        console.log('Received user ID:', userId);

        // トークンとユーザーIDを保存
        localStorage.setItem('jwt', token);
        
        if (userId) {
          localStorage.setItem('userId', userId);
          
          // ユーザー情報を取得して確認（オプション）
          try {
            const response = await axios.get(`${API_BASE_URL}/users/show`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            console.log('User data fetched successfully:', response.data);
          } catch (userError) {
            console.error('エラー: ユーザー情報取得中', userError);
            // トークンとIDが取得できていれば処理は続行
          }
          
          // ホームページにリダイレクト
          navigate('/', { replace: true });
        } else {
          setError('ユーザーIDが見つかりません');
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
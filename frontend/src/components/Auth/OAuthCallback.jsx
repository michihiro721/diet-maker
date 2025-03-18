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
        console.log('OAuth callback URL:', location.search);
        
        // URLパラメータからトークンとユーザーIDを取得
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userId = params.get('user_id');
        const error = params.get('error');
        
        // エラーがある場合
        if (error) {
          console.error('Error from OAuth flow:', error);
          setError(`認証エラー: ${error}`);
          setLoading(false);
          return;
        }

        // トークンがない場合
        if (!token) {
          console.error('No token found in callback URL');
          setError('トークンが見つかりません');
          setLoading(false);
          return;
        }

        console.log('Token received:', token);
        console.log('User ID received:', userId);

        // ローカルストレージをクリア
        localStorage.removeItem('jwt');
        localStorage.removeItem('userId');
        
        try {
          // トークンを使ってユーザー情報を取得
          const response = await axios.get(`${API_BASE_URL}/users/show`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          console.log('User data from API:', response.data);
          
          if (response.data && response.data.id) {
            // APIから取得したユーザー情報をローカルストレージに保存
            localStorage.setItem('jwt', token);
            localStorage.setItem('userId', response.data.id);
            
            console.log('Saved user data to localStorage from API:', {
              token,
              userId: response.data.id
            });
          } else {
            // ユーザー情報が取得できなかった場合は、URLから取得したIDを使用
            localStorage.setItem('jwt', token);
            localStorage.setItem('userId', userId);
            
            console.log('Saved user data to localStorage from URL:', {
              token,
              userId
            });
          }
        } catch (apiError) {
          // APIエラーが発生した場合
          console.error('Error fetching user info:', apiError);
          
          // 2回目の試行 - `/users/:id` エンドポイントを試す
          try {
            const userResponse = await axios.get(`${API_BASE_URL}/users/${userId}`);
            if (userResponse.data && userResponse.data.id) {
              localStorage.setItem('jwt', token);
              localStorage.setItem('userId', userResponse.data.id);
              
              console.log('Saved user data from users/:id endpoint:', {
                token,
                userId: userResponse.data.id
              });
            } else {
              // フォールバック
              localStorage.setItem('jwt', token);
              localStorage.setItem('userId', userId);
              
              console.log('Saved fallback data to localStorage:', {
                token,
                userId
              });
            }
          } catch (secondError) {
            console.error('Error fetching user by ID:', secondError);
            // 最終フォールバック
            localStorage.setItem('jwt', token);
            localStorage.setItem('userId', userId);
            
            console.log('Saved final fallback data to localStorage:', {
              token,
              userId
            });
          }
        }
        
        // 現在のローカルストレージの状態をログ出力
        console.log('Current localStorage state:', {
          jwt: localStorage.getItem('jwt'),
          userId: localStorage.getItem('userId')
        });
        
        // 1秒待機してからリダイレクト
        setTimeout(() => {
          // ホーム画面にリダイレクト
          navigate('/', { replace: true });
        }, 1000);
      } catch (err) {
        // 全体的なエラーハンドリング
        console.error('Authentication callback error:', err);
        setError('認証処理中にエラーが発生しました');
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
        <div style={{ 
          width: '50px', 
          height: '50px', 
          border: '5px solid #f3f3f3', 
          borderTop: '5px solid #3498db', 
          borderRadius: '50%',
          animation: 'spin 2s linear infinite',
          margin: '20px 0'
        }} />
        <p>しばらくお待ちください</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
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
        <button 
          onClick={() => navigate('/login')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          ログイン画面に戻る
        </button>
      </div>
    );
  }

  return null;
};

export default OAuthCallback;
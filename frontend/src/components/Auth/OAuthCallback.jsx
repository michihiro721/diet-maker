import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // axiosをインポート

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
        
        if (error) {
          console.error('Error from OAuth flow:', error);
          setError(`認証エラー: ${error}`);
          setLoading(false);
          return;
        }

        if (!token) {
          console.error('No token found in callback URL');
          setError('トークンが見つかりません');
          setLoading(false);
          return;
        }

        console.log('Token received:', token);
        console.log('User ID received:', userId);

        // トークンをローカルストレージに保存する前に、サーバーからユーザー情報を取得
        try {
          // APIエンドポイントのベースURL
          const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.diet-maker.com';
          
          // JWTトークンをAuthorizationヘッダーに設定
          const config = {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          };
          
          // ユーザー情報を取得
          const response = await axios.get(`${API_BASE_URL}/api/v1/users/me`, config);
          
          if (response.data && response.data.id) {
            // 正しいuserIdを取得
            const correctUserId = response.data.id;
            
            // ローカルストレージにトークンと正しいユーザーIDを保存
            localStorage.setItem('jwt', token);
            localStorage.setItem('userId', correctUserId);
            
            console.log('Updated user info from server:', response.data);
            console.log('Saved to localStorage:', {
              jwt: localStorage.getItem('jwt'),
              userId: localStorage.getItem('userId')
            });
          } else {
            // バックアップとして、元のuserIdを使用
            localStorage.setItem('jwt', token);
            localStorage.setItem('userId', userId);
            
            console.log('Saved to localStorage (fallback):', {
              jwt: localStorage.getItem('jwt'),
              userId: localStorage.getItem('userId')
            });
          }
        } catch (apiError) {
          console.error('Error fetching user info:', apiError);
          
          // エラーが発生した場合でも、元のトークンとユーザーIDを保存
          localStorage.setItem('jwt', token);
          if (userId) {
            localStorage.setItem('userId', userId);
          }
          
          console.log('Saved to localStorage (despite API error):', {
            jwt: localStorage.getItem('jwt'),
            userId: localStorage.getItem('userId')
          });
        }
        
        // 1秒待機してからリダイレクト（状態の更新を確実にするため）
        setTimeout(() => {
          // ホーム画面にリダイレクト
          navigate('/', { replace: true });
        }, 1000);
      } catch (err) {
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
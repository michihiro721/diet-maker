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

        // ローカルストレージに保存する前にデータをクリア
        localStorage.removeItem('jwt');
        localStorage.removeItem('userId');

        // APIエンドポイントのベースURL
        const API_BASE_URL = process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000'
          : 'https://diet-maker-d07eb3099e56.herokuapp.com';
        
        try {
          // JWTトークンをAuthorizationヘッダーに設定してユーザー情報を取得
          const response = await axios.get(`${API_BASE_URL}/users/show`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          console.log('User data from API:', response.data);
          
          if (response.data && response.data.id) {
            // API経由で取得したユーザーID
            const verifiedUserId = response.data.id;
            
            // ローカルストレージにトークンとユーザーIDを保存
            localStorage.setItem('jwt', token);
            localStorage.setItem('userId', verifiedUserId);
            
            console.log('Saved verified data to localStorage:', {
              jwt: token,
              userId: verifiedUserId
            });
          } else {
            // APIからユーザー情報が取得できなかった場合はURLのユーザーIDを使用
            localStorage.setItem('jwt', token);
            localStorage.setItem('userId', userId);
            
            console.log('Saved URL data to localStorage:', {
              jwt: token,
              userId: userId
            });
          }
        } catch (apiError) {
          console.error('Error fetching user info:', apiError);
          // エラーが発生した場合でも、URLから取得したユーザーIDを使用
          localStorage.setItem('jwt', token);
          localStorage.setItem('userId', userId);
          
          console.log('Saved fallback data to localStorage:', {
            jwt: token,
            userId: userId
          });
        }
        
        // ローカルストレージの保存を確認
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
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
        
        // URLからトークンとユーザーIDを取得
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
        
        if (userId) {
          console.log('User ID received:', userId);
        } else {
          console.warn('No user ID in callback URL');
        }

        // トークンをlocalStorageに保存
        localStorage.setItem('jwt', token);
        
        if (userId) {
          localStorage.setItem('userId', userId);
        }
        
        // ユーザー情報を取得（オプション）
        try {
          console.log('Fetching user data...');
          const response = await axios.get(`${API_BASE_URL}/users/show`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          console.log('User data received:', response.data);
          
          // ユーザー情報をlocalStorageに追加保存（必要に応じて）
          if (response.data && response.data.id) {
            // userIdが無い場合のみ保存
            if (!userId) {
              localStorage.setItem('userId', response.data.id);
            }
            // その他の情報を保存したい場合
            localStorage.setItem('userEmail', response.data.email);
            localStorage.setItem('userName', response.data.nickname || '');
          }
        } catch (userError) {
          console.error('Error fetching user data:', userError);
          // ユーザー情報の取得に失敗してもトークンがあれば続行
        }
        
        // ホームページにリダイレクト
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Auth callback error:', err);
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
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        sessionStorage.getItem('auth_started');

        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userId = params.get('user_id');
        const error = params.get('error');

        if (error) {
          setError(`認証エラー: ${error}`);
          setLoading(false);
          return;
        }

        if (!token) {
          setError('トークンが見つかりません');
          setLoading(false);
          return;
        }

        localStorage.removeItem('jwt');
        localStorage.removeItem('userId');

        try {
          const config = {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache',
              'If-Modified-Since': '0'
            }
          };

          const response = await axios.get(`${API_BASE_URL}/users/show`, config);

          if (response.data && response.data.id) {
            localStorage.setItem('jwt', token);
            localStorage.setItem('userId', response.data.id);
          } else {
            localStorage.setItem('jwt', token);
            localStorage.setItem('userId', userId);
          }
        } catch (apiError) {
          localStorage.setItem('jwt', token);
          localStorage.setItem('userId', userId);
        }

        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
      } catch (err) {
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
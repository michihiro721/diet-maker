import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://diet-maker-d07eb3099e56.herokuapp.com';

const AuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // URLからトークンを取得
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (!token) {
          setError('認証トークンが見つかりません');
          return;
        }

        // トークンをローカルストレージに保存
        localStorage.setItem('jwt', token);

        // ユーザー情報を取得
        try {
          const res = await axios.get(`${API_BASE_URL}/users/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          // ユーザーIDを保存
          if (res.data && res.data.id) {
            localStorage.setItem('userId', res.data.id);
          }
        } catch (error) {
          console.error('ユーザー情報取得エラー:', error);
          // エラーがあってもログインは継続
        }

        setLoading(false);
        
        // ログイン成功メッセージ
        alert('ログインに成功しました');
        
        // ログイン成功後、ホームページにリダイレクト
        window.location.href = '/';
      } catch (error) {
        console.error('認証コールバックエラー:', error);
        setError('認証処理中にエラーが発生しました');
        setLoading(false);
      }
    };

    processCallback();
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="auth-callback-container">
        <div className="loading-spinner"></div>
        <p>認証処理中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-callback-container">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate('/login')}>ログイン画面に戻る</button>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
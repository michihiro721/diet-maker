import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './styles/ForgotPassword.css';

const API_BASE_URL = 'https://diet-maker-d07eb3099e56.herokuapp.com/';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/password`, {
        user: {
          email: data.email
        }
      }, {
        headers: { "Content-Type": "application/json" }
      });

      if (response.status === 200) {
        setMessage('パスワードリセットのメールを送信しました。メールをご確認ください。');
      }
    } catch (error) {
      setError('メールの送信に失敗しました。正しいメールアドレスを入力してください。');
      console.error('パスワードリセットエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>パスワードをお忘れの方</h2>
      <p>登録したメールアドレスを入力して、<br />パスワードリセット用のリンクを送信します。</p>
      
      {message && <div className="forgot-password-success-message">{message}</div>}
      {error && <div className="forgot-password-error-message">{error}</div>}
      
      <form onSubmit={handleSubmit(onSubmit)} className="forgot-password-form">
        <div>
          <label>メールアドレス</label>
          <input
            type="email"
            {...register('email', { 
              required: 'メールアドレスを入力してください',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '有効なメールアドレスを入力してください'
              }
            })}
          />
          {errors.email && <p className="forgot-password-form-error">{errors.email.message}</p>}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? '送信中...' : 'リセットリンクを送信'}
        </button>
      </form>
      <div className="forgot-password-auth-links">
        <a href="/login">ログインページに戻る</a>
      </div>
    </div>
  );
};

export default ForgotPassword;
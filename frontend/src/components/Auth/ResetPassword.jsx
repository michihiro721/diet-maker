// frontend/src/components/Auth/ResetPassword.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/ResetPassword.css';

const API_BASE_URL = 'https://diet-maker-d07eb3099e56.herokuapp.com/';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.put(`${API_BASE_URL}/auth/password`, {
        user: {
          reset_password_token: token,
          password: data.password,
          password_confirmation: data.passwordConfirmation
        }
      }, {
        headers: { "Content-Type": "application/json" }
      });

      if (response.status === 200) {
        setMessage('パスワードが正常に更新されました。');
        // 3秒後にログインページへリダイレクト
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      setError('パスワードの更新に失敗しました。トークンが無効か期限切れです。');
      console.error('パスワードリセットエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>新しいパスワードを設定</h2>
      
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit(onSubmit)} className="reset-password-form">
        <div>
          <label>新しいパスワード</label>
          <input
            type="password"
            {...register('password', { 
              required: 'パスワードを入力してください',
              minLength: {
                value: 6,
                message: 'パスワードは6文字以上である必要があります'
              }
            })}
          />
          {errors.password && <p className="form-error">{errors.password.message}</p>}
        </div>
        <div>
          <label>パスワード（確認）</label>
          <input
            type="password"
            {...register('passwordConfirmation', { 
              required: 'パスワードを再入力してください',
              validate: value => value === watch('password') || 'パスワードが一致しません'
            })}
          />
          {errors.passwordConfirmation && <p className="form-error">{errors.passwordConfirmation.message}</p>}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? '更新中...' : 'パスワードを更新'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
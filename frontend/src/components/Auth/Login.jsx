import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './styles/Login.css';
import GoogleLoginButton from './GoogleLoginButton';

const API_BASE_URL = 'https://diet-maker-d07eb3099e56.herokuapp.com';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [flashMessage, setFlashMessage] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    if (token) {
      localStorage.setItem('jwt', token);
      fetchUserInfo(token);
    }
  }, [location]);


  const showFlashMessage = (message, type) => {
    setFlashMessage(null);
    // 遅延を入れることで、アニメーションが正しく再生されるようにした
    setTimeout(() => {
      setFlashMessage({ message, type });
    }, 50);

    // 6秒後にメッセージを消す
    setTimeout(() => {
      setFlashMessage(null);
    }, 6000);
  };

  const fetchUserInfo = async (token) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/show`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.data) {
        localStorage.setItem('userId', res.data.id);
        showFlashMessage('Googleアカウントでログインしました', 'success');

        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      }
    } catch (error) {
      showFlashMessage('パスワードを再入力してください', 'error');
    }
  };

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/sign_in`, {
        user: {
          email: data.email,
          password: data.password,
        },
      }, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 200) {
        const token = res.headers['authorization'];
        if (token) {
          const cleanToken = token.replace('Bearer ', '');
          localStorage.setItem('jwt', cleanToken);
        }

        const userId = res.data.user.id;
        localStorage.setItem('userId', userId);

        showFlashMessage('ログインに成功しました', 'success');

        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        showFlashMessage('ログインに失敗しました', 'error');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        showFlashMessage(`ログインに失敗しました: ${error.response.data.errors.join(', ')}`, 'error');
      } else {
        showFlashMessage('パスワードを再入力してください', 'error');
      }
    }
  };

  const goToSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="custom-login-container">
      {flashMessage && (
        <div className={`flash-message ${flashMessage.type}`}>
          {flashMessage.message}
        </div>
      )}
      <h2>ログイン</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="custom-login-form">
        <div>
          <label>メールアドレス</label>
          <input
            type="email"
            {...register('email', { required: 'メールアドレスを入力してください' })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label>パスワード</label>
          <input
            type="password"
            {...register('password', { required: 'パスワードを入力してください' })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <button type="submit">ログイン</button>
      </form>

      {/* Googleログインボタン */}
      <div className="social-login">
        <p className="or-divider">または</p>
        <GoogleLoginButton />
      </div>

      <button onClick={goToSignUp} className="signup-button">新規登録</button>
      <div className="forgot-password-link">
        <a href="/forgot-password">パスワードをお忘れですか？</a>
      </div>
    </div>
  );
};

export default Login;
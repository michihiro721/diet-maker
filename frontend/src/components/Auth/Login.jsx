import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Login.css';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('/auth/sign_in', {
        user: {
          email: data.email,
          password: data.password,
        },
      });
      if (res.status === 200) {
        alert('ログインに成功しました');
        navigate('/');
      } else {
        alert('ログインに失敗しました');
      }
    } catch (error) {
      console.error('ログインエラー:', error);
      alert('ログイン中にエラーが発生しました');
    }
  };

  const goToSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="custom-login-container">
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
      <button onClick={goToSignUp} className="signup-button">新規登録</button>
    </div>
  );
};

export default Login;
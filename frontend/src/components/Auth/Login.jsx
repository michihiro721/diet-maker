import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/users/sign_in', {
        user: {
          email,
          password,
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
    <div className="login-container">
      <h2>ログイン</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">ログイン</button>
      </form>
      <button onClick={goToSignUp}>新規登録</button>
    </div>
  );
};

export default Login;
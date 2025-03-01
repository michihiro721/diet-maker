import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/SignUp.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/users', {
        user: {
          email,
          password,
          password_confirmation: passwordConfirmation,
        },
      });
      if (res.status === 201) {
        alert('新規登録に成功しました');
        navigate('/login');
      } else {
        alert('新規登録に失敗しました');
      }
    } catch (error) {
      console.error('新規登録エラー:', error);
      alert('新規登録中にエラーが発生しました');
    }
  };

  return (
    <div className="signup-container">
      <h2>新規登録</h2>
      <form onSubmit={handleSignUp}>
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
        <div>
          <label>Password Confirmation:</label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
        </div>
        <button type="submit">新規登録</button>
      </form>
    </div>
  );
};

export default SignUp;
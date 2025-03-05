import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Profile.css';

const API_BASE_URL = 'https://diet-maker-d07eb3099e56.herokuapp.com';

const Profile = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('jwt');
      if (!token) {
        alert('ログインしてください');
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmail(res.data.email);
        setNickname(res.data.nickname);
      } catch (error) {
        console.error('プロフィール取得エラー:', error);
        alert('ログインしてください');
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleNicknameChange = async () => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      alert('ログインしてください');
      navigate('/login');
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/profile`, {
        nickname: newNickname,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNickname(newNickname);
      alert('ニックネームが更新されました');
    } catch (error) {
      console.error('ニックネーム更新エラー:', error);
      alert('ニックネームの更新に失敗しました');
    }
  };

  return (
    <div className="profile-container">
      <h1>プロフィール</h1>
      <p>メールアドレス: {email}</p>
      <p>ニックネーム: {nickname}</p>
      <input
        type="text"
        value={newNickname}
        onChange={(e) => setNewNickname(e.target.value)}
        placeholder="新しいニックネーム"
      />
      <button onClick={handleNicknameChange}>ニックネームを変更</button>
    </div>
  );
};

export default Profile;
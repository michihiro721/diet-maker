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
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        alert('ログインしてください');
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/users/show`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        });

        setEmail(res.data.email);
        setNickname(res.data.name);
      } catch (error) {

        if (error.response?.status === 401 &&
            error.response?.data?.error === 'Signature has expired') {
          localStorage.removeItem('jwt');
          localStorage.removeItem('userId');
          alert('セッションの有効期限が切れました。再度ログインしてください。');
          navigate('/login');
        } else {
          alert('プロフィール情報の取得に失敗しました。');
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleNicknameChange = async () => {
    const token = localStorage.getItem('jwt');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      alert('ログインしてください');
      navigate('/login');
      return;
    }

    if (!newNickname.trim()) {
      alert('ニックネームを入力してください');
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/users/${userId}`, {
        user: {
          name: newNickname
        }
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      setNickname(newNickname);
      setNewNickname('');
      alert('ニックネームが更新されました');
    } catch (error) {
      alert('ニックネームの更新に失敗しました');
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">プロフィール</h1>
      <div className="profile-info">
        <p className="profile-email">メールアドレス: {email || '読み込み中...'}</p>
        <p className="profile-nickname">ニックネーム: {nickname || '読み込み中...'}</p>
      </div>
      <div className="profile-form">
        <input
          type="text"
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
          placeholder="新しいニックネーム"
          className="profile-input"
        />
        <button
          onClick={handleNicknameChange}
          className="profile-button"
        >
          ニックネームを変更
        </button>
      </div>
    </div>
  );
};

export default Profile;
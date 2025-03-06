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
        console.log('Token:', token);
        console.log('UserID:', userId);
        
        const res = await axios.get(`${API_BASE_URL}/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        });
        
        console.log('API Response:', res.data);
        
        setEmail(res.data.email);
        setNickname(res.data.nickname);
      } catch (error) {
        console.error('プロフィール取得エラー:', error);
        console.error('エラーレスポンス:', error.response?.data);
        console.error('エラーステータス:', error.response?.status);
        
        // トークン期限切れの場合
        if (error.response?.status === 401 && 
            error.response?.data?.error === 'Signature has expired') {
          localStorage.removeItem('jwt'); // 期限切れトークンを削除
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
      const res = await axios.put(`${API_BASE_URL}/users/${userId}`, {
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
      
      // デバッグログ
      console.log('Update response:', res.data);
      
      setNickname(newNickname);
      setNewNickname(''); // 入力フィールドをクリア
      alert('ニックネームが更新されました');
    } catch (error) {
      console.error('ニックネーム更新エラー:', error);
      console.error('エラーレスポンス:', error.response?.data);
      alert('ニックネームの更新に失敗しました');
    }
  };

  return (
    <div className="profile-container">
      <h1>プロフィール</h1>
      <div className="profile-info">
        <p>メールアドレス: {email || '読み込み中...'}</p>
        <p>ニックネーム: {nickname || '読み込み中...'}</p>
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
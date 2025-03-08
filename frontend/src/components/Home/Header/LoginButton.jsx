import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import "./styles/LoginButton.css";

const LoginButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ログイン状態をチェックする関数
  const checkLoginStatus = () => {
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(userId !== null);
  };

  // コンポーネントのマウント時およびローカルストレージの変更時にログイン状態を確認
  useEffect(() => {
    // 初期チェック
    checkLoginStatus();

    // ローカルストレージの変更を監視
    window.addEventListener('storage', checkLoginStatus);

    // カスタムイベントをリッスン
    window.addEventListener('loginStateChanged', checkLoginStatus);

    // クリーンアップ関数
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('loginStateChanged', checkLoginStatus);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div>
      <button
        className="header-login-button"
        onClick={toggleMenu}
      >
        <i className={`fa-solid fa-user ${isLoggedIn ? 'user-logged-in' : ''}`}></i>
      </button>
      {isMenuOpen && <LoginModal closeMenu={closeMenu} />}
    </div>
  );
};

export default LoginButton;
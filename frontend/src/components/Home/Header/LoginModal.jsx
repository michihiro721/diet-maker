import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/LoginMenuModal.css";

const LoginModal = ({ closeMenu }) => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();

    // ローカルストレージからユーザー情報を削除
    localStorage.removeItem('userId');
    localStorage.removeItem('jwt');

    // ユーザーにログアウトを通知
    alert('ログアウトしました');

    // メニューを閉じる
    closeMenu();

    // ホームページにリダイレクト
    navigate('/');

    // ページをリロードして全てのユーザー依存のデータを更新
    window.location.reload();
  };

  // ログイン状態の確認
  const isLoggedIn = localStorage.getItem('userId') !== null;

  return (
    <div className="header-login-menu-overlay" onClick={closeMenu}>
      <div className="header-login-menu-modal" onClick={(e) => e.stopPropagation()}>
        <ul className="header-login-menu-list">
          {isLoggedIn ? (
            // ログイン済みの場合に表示するメニュー
            <>
              <li><Link to="/profile" onClick={closeMenu}>プロフィール</Link></li>
              <li><a href="#" onClick={handleLogout}>ログアウト</a></li>
            </>
          ) : (
            // 未ログインの場合に表示するメニュー
            <>
              <li><Link to="/login" onClick={closeMenu}>ログイン</Link></li>
              <li><Link to="/signup" onClick={closeMenu}>新規登録</Link></li>
            </>
          )}
        </ul>
        <button className="header-login-close-button" onClick={closeMenu}>
          閉じる
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
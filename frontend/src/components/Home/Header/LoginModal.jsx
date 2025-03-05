import React from "react";
import { Link } from "react-router-dom";
import "./styles/LoginMenuModal.css";

const LoginModal = ({ closeMenu }) => {
  return (
    <div className="header-login-menu-overlay" onClick={closeMenu}>
      <div className="header-login-menu-modal" onClick={(e) => e.stopPropagation()}>
        <ul className="header-login-menu-list">
          <li><Link to="/profile" onClick={closeMenu}>プロフィール</Link></li>
          <li><Link to="/login" onClick={closeMenu}>ログイン</Link></li>
          <li><Link to="/logout" onClick={closeMenu}>ログアウト</Link></li>
        </ul>
        <button className="header-login-close-button" onClick={closeMenu}>
          閉じる
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
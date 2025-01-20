import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/header.css"; // CSSファイルをインポート

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div>
      {/* ヘッダー */}
      <header className="header">
        <div className="header-title">ダイエットメーカー</div>
        <button className="menu-button" onClick={toggleMenu}>
          <i className="fas fa-bars"></i>
        </button>
      </header>

      {/* モーダルウィンドウ */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenu}>
          <div className="menu-modal" onClick={(e) => e.stopPropagation()}>
            <ul className="menu-list">
              <li><Link to="/achievements" onClick={closeMenu}>成果</Link></li>
              <li><Link to="/goal-setting" onClick={closeMenu}>目標設定</Link></li>
              <li><Link to="/training-menu" onClick={closeMenu}>トレーニングメニュー提案</Link></li>
              <li><Link to="/body-info" onClick={closeMenu}>身体情報</Link></li>
              <li><Link to="/calorie-info" onClick={closeMenu}>カロリー関係</Link></li>
              <li><Link to="/weight" onClick={closeMenu}>体重</Link></li>
              <li><Link to="/diet-mindset" onClick={closeMenu}>ダイエット心構え</Link></li>
              <li><Link to="/posts" onClick={closeMenu}>みんなの投稿一覧</Link></li>
              <li><Link to="/app-usage" onClick={closeMenu}>アプリ使い方</Link></li>
            </ul>
            <button className="close-button" onClick={closeMenu}>
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
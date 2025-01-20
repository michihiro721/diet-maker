// このコードは、ウェブサイトのヘッダーを表示するためのコンポーネントです。
// ヘッダーには、サイトのタイトルが含まれています。

import React, { useState } from "react";
import "./styles/header.css"; // CSSファイルをインポート

// Headerコンポーネントを定義
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
          ≡
        </button>
      </header>

      {/* モーダルウィンドウ */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenu}>
          <div className="menu-modal" onClick={(e) => e.stopPropagation()}>
            <ul className="menu-list">
              <li>成果</li>
              <li>目標設定</li>
              <li>トレーニングメニュー提案</li>
              <li>身体情報</li>
              <li>カロリー関係</li>
              <li>体重</li>
              <li>ダイエット心構え</li>
              <li>みんなの投稿一覧</li>
              <li>アプリ使い方</li>
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

// Headerコンポーネントをエクスポート
export default Header;
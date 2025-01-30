// ReactとuseStateフックをインポート
import React, { useState } from "react";
// メニューボタンとモーダルウィンドウのコンポーネントをインポート
import MenuButton from "./MenuButton";
import MenuModal from "./MenuModal";
// Header用のCSSファイルをインポート
import "./styles/header.css";

// Headerコンポーネントの定義
const Header = () => {
  // メニューの開閉状態を管理するための状態変数とその更新関数を定義
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // メニューの開閉を切り替える関数
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // メニューを閉じる関数
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div>
      {/* ヘッダー */}
      <header className="header">
        <div className="header-title">ダイエットメーカー</div>
        {/* メニューボタン */}
        <MenuButton toggleMenu={toggleMenu} />
      </header>

      {/* モーダルウィンドウ */}
      {isMenuOpen && <MenuModal closeMenu={closeMenu} />}
    </div>
  );
};

// Headerコンポーネントをエクスポート
export default Header;
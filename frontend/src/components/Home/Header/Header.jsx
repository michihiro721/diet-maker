import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // useLocationとuseNavigateフックをインポート
import MenuButton from "./MenuButton";
import MenuModal from "./MenuModal";
import "./styles/header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); // 現在のURLパスを取得
  const navigate = useNavigate(); // 画面遷移用のフック

  // メニューの開閉を切り替える関数
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // メニューを閉じる関数
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // ホーム画面に戻る関数
  const goToHome = () => {
    navigate("/"); // ルートページに遷移
  };

  // URLパスに応じてタイトルを設定
  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "ダイエットメーカー";
      case "/achievements":
        return "成果";
      case "/goal-setting":
        return "目標設定";
      case "/training-menu":
        return "トレーニングメニュー提案";
      case "/body-info":
        return "身体情報";
      case "/calorie-info":
        return "カロリー関係";
      case "/weight":
        return "体重";
      case "/diet-mindset":
        return "ダイエット心構え";
      case "/posts":
        return "みんなの投稿一覧";
      case "/app-usage":
        return "アプリ使い方";
      case "/contact":
        return "お問い合わせ";
      case "/terms":
        return "利用規約";
      case "/privacy":
        return "プライバシーポリシー";

      default:
        return "ダイエットメーカー";
    }
  };

  return (
    <div>
      <header className="header">
        {/* ホーム画面以外で戻るボタンを表示 */}
        {location.pathname !== "/" && (
          <button className="back-button" onClick={goToHome}>
            <i className="fa-solid fa-circle-left"></i>
          </button>
        )}
        <div className="header-title">{getTitle()}</div>
        <MenuButton toggleMenu={toggleMenu} />
      </header>

      {isMenuOpen && <MenuModal closeMenu={closeMenu} />}
    </div>
  );
};

export default Header;
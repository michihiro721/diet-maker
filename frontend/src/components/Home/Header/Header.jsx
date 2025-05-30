import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MenuButton from "./MenuButton";
import MenuModal from "./MenuModal";
import LoginButton from "./LoginButton";
import "./styles/header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const goToHome = () => {
    navigate("/");
  };

  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "ダイエットメーカー";
      case "/achievements":
        return "成果";
      case "/goal-setting":
        return "目標設定";
      case "/training-menu":
        return "トレーニングメニュー";
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
        {location.pathname !== "/" && (
          <button className="header-back-button" onClick={goToHome}>
            <i className="fa-solid fa-circle-left"></i>
          </button>
        )}
        <div className="header-title">{getTitle()}</div>
        <LoginButton />
        <MenuButton toggleMenu={toggleMenu} />
      </header>

      {isMenuOpen && <MenuModal closeMenu={closeMenu} />}
    </div>
  );
};

export default Header;
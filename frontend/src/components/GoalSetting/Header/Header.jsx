import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ルーティングのために追加
import MenuButton from "./MenuButton";
import MenuModal from "./MenuModal";
import "./styles/goalSettingHeader.css"; // クラス名を一意にするためにCSSファイル名を変更

const GoalSettingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  return (
    <div>
      <header className="goal-setting-header">
        {/* ホームに戻るボタン */}
        <button className="goal-setting-back-button" onClick={goToHome}>
          <i className="fa-solid fa-circle-left"></i>
        </button>

        <div className="goal-setting-header-title">目標設定</div>

        {/* メニューボタン */}
        <MenuButton toggleMenu={toggleMenu} />
      </header>

      {/* モーダルウィンドウ */}
      {isMenuOpen && <MenuModal closeMenu={closeMenu} />}
    </div>
  );
};

export default GoalSettingHeader;
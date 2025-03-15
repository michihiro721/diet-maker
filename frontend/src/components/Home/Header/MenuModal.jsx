// ReactとLinkコンポーネントをインポート
import React from "react";
import { Link } from "react-router-dom";
// MenuModal用のCSSファイルをインポート
import "./styles/MenuModal.css";

// MenuModalコンポーネントの定義
const MenuModal = ({ closeMenu }) => {
  return (
    // モーダルのオーバーレイをクリックするとメニューを閉じる
    <div className="header-menu-overlay" onClick={closeMenu}>
      {/* モーダルウィンドウ */}
      <div className="header-menu-modal" onClick={(e) => e.stopPropagation()}>
        {/* ナビゲーションリンクのリスト */}
        <ul className="header-menu-list">
          <li><Link to="/goal-setting" onClick={closeMenu}>目標設定</Link></li>
          <li><Link to="/training-menu" onClick={closeMenu}>トレーニングメニュー提案</Link></li>
          <li><Link to="/body-info" onClick={closeMenu}>身体情報</Link></li>
          <li><Link to="/diet-mindset" onClick={closeMenu}>ダイエット心構え</Link></li>
          <li><Link to="/app-usage" onClick={closeMenu}>アプリ使い方</Link></li>
        </ul>
        {/* 閉じるボタン */}
        <button className="header-close-button" onClick={closeMenu}>
          閉じる
        </button>
      </div>
    </div>
  );
};

// MenuModalコンポーネントをエクスポート
export default MenuModal;
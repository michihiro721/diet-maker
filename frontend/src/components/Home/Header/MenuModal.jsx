// ReactとLinkコンポーネントをインポート
import React from "react";
import { Link } from "react-router-dom";
// MenuModal用のCSSファイルをインポート
import "./styles/MenuModal.css";

// MenuModalコンポーネントの定義
const MenuModal = ({ closeMenu }) => {
  return (
    // モーダルのオーバーレイをクリックするとメニューを閉じる
    <div className="menu-overlay" onClick={closeMenu}>
      {/* モーダルウィンドウ */}
      <div className="menu-modal" onClick={(e) => e.stopPropagation()}>
        {/* ナビゲーションリンクのリスト */}
        <ul className="header-menu-list">
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
        {/* 閉じるボタン */}
        <button className="close-buttn" onClick={closeMenu}>
          閉じる
        </button>
      </div>
    </div>
  );
};

// MenuModalコンポーネントをエクスポート
export default MenuModal;
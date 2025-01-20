// Reactをインポート
import React from "react";
// MenuButton用のCSSファイルをインポート
import "./styles/MenuButton.css";

// MenuButtonコンポーネントの定義
const MenuButton = ({ toggleMenu }) => {
  return (
    // ボタン要素をレンダリングし、クリック時にtoggleMenu関数を呼び出す
    <button className="menu-button" onClick={toggleMenu}>
      {/* アイコンを表示 */}
      <i className="fas fa-bars"></i>
    </button>
  );
};

// MenuButtonコンポーネントをエクスポート
export default MenuButton;
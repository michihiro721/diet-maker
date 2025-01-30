// Reactをインポート
import React from "react";
// MenuButton用のCSSファイルをインポート
import "./styles/MenuButton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";


// MenuButtonコンポーネントの定義
const MenuButton = ({ toggleMenu }) => {
  return (
    // ボタン要素をレンダリングし、クリック時にtoggleMenu関数を呼び出す
    <button className="menu-button" onClick={toggleMenu}>
      {/* アイコンを表示 */}
      <FontAwesomeIcon icon={faBars} />
    </button>
  );
};

// MenuButtonコンポーネントをエクスポート
export default MenuButton;
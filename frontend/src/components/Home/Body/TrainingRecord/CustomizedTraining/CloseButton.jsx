// Reactをインポート
import React from "react";
// CloseButton用のCSSファイルをインポート
import './styles/CloseButton.css';

// CloseButtonコンポーネントの定義
const CloseButton = ({ closeModal }) => {
  return (
    // ボタン要素をレンダリングし、クリック時にcloseModal関数を呼び出す
    <button className="close-button" onClick={closeModal}>
      閉じる
    </button>
  );
};

// CloseButtonコンポーネントをエクスポート
export default CloseButton;
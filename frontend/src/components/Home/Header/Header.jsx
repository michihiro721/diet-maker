// このコードは、ウェブサイトのヘッダーを表示するためのコンポーネントです。
// ヘッダーには、サイトのタイトルが含まれています。

import React from 'react';
import './Header.css'; // CSSファイルをインポート

// Headerコンポーネントを定義
function Header() {
    return (
        // ヘッダー要素を返す。クラス名はheaderを使用
        <header className="header">
            {/* タイトル要素を返す。クラス名はtitleを使用 */}
            <h1 className="title">ダイエットメーカー</h1>
        </header>
    );
}

// Headerコンポーネントをエクスポート
export default Header;
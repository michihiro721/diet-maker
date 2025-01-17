import React from 'react';

// Headerコンポーネントを定義
function Header() {
    return (
        // ヘッダー要素を返す。スタイルはstyles.headerを使用
        <header style={styles.header}>
            {/* タイトル要素を返す。スタイルはstyles.titleを使用 */}
            <h1 style={styles.title}>ダイエットメーカー</h1>
        </header>
    );
}

// スタイルオブジェクトを定義
const styles = {
    // ヘッダーのスタイル
    header: {
        backgroundColor: '#5D9CEC', // 背景色を設定
        textAlign: 'center', // テキストを中央揃え
        padding: '10px 0', // 上下に10pxのパディングを設定
        margin: 0, // マージンを0に設定
        width: '100%', // 幅を100%に設定
        position: 'fixed', // 固定位置に設定
        top: 0, // 上端に固定
        left: 0, // 左端に固定
    },
    // タイトルのスタイル
    title: {
        color: 'white', // テキストの色を白に設定
        margin: 0, // マージンを0に設定
    },
};

// Headerコンポーネントをエクスポート
export default Header;
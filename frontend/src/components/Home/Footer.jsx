import React from 'react'; // reactをインポート
import { FaTwitter, FaGithub } from 'react-icons/fa'; // react-iconsからFaTwitterとFaGithubをインポート

// Footerコンポーネントを定義
function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.links}>
        <a href="/contact" style={styles.link} target="_blank" rel="noopener noreferrer">お問い合わせ</a>
        <a href="/terms" style={styles.link} target="_blank" rel="noopener noreferrer">利用規約</a>
        <a href="/privacy" style={styles.link} target="_blank" rel="noopener noreferrer">プライバシーポリシー</a>
      </div>
      <div style={styles.icons}>
        <a href="https://x.com/michihiro721" style={styles.iconLink} target="_blank" rel="noopener noreferrer">
          <FaTwitter style={styles.icon} />
        </a>
        <a href="https://github.com/michihiro721/" style={styles.iconLink} target="_blank" rel="noopener noreferrer">
          <FaGithub style={styles.icon} />
        </a>
      </div>
      <div style={styles.copy}>
        &copy; 2025 - ver.1.00
      </div>
    </footer>
  );
}

// スタイルオブジェクトを定義
const styles = {
  footer: {
    backgroundColor: '#5D9CEC',
    color: 'white', // テキストの色を白に設定
    textAlign: 'center', // テキストを中央揃え
    padding: '20px 0', // 上下に20px
    position: 'fixed', // 固定位置に設定
    bottom: 0, // 下端に固定
    width: '100%', // 幅を100%に設定
    left: '50%', // 左端を50%に設定
    transform: 'translateX(-50%)', // 中央に固定するためにX軸方向に50%移動
  },
  links: { // リンクのスタイル
    marginBottom: '10px', // 下に10pxのマージン
  },
  link: { // リンクのスタイル
    color: 'white', // テキストの色を白に設定
    margin: '0 15px', // 左右に15px
    textDecoration: 'none', // 下線を消す
  },
  icons: { // アイコンのスタイル
    marginBottom: '10px', // 下に10pxのマージン
  },
  iconLink: { // アイコンのリンクのスタイル
    margin: '0 10px', // 左右に10px
  },
  icon: { // アイコンのスタイル
    color: 'white',
    fontSize: '30px', // アイコンのサイズ
  },
  copy: { // コピーライトのスタイル
    fontSize: '14px',
  },
};

// Footerコンポーネントをエクスポート
export default Footer;
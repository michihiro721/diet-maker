import React from 'react'; // reactをインポート
import { FaTwitter, FaGithub } from 'react-icons/fa'; // react-iconsからFaTwitterとFaGithubをインポート
import './Footer.css'; // CSSファイルをインポート

// Footerコンポーネントを定義
function Footer() {
  return (
    <footer className="footer">
      <div className="links">
        <a href="/contact" className="link" target="_blank" rel="noopener noreferrer">お問い合わせ</a>
        <a href="/terms" className="link" target="_blank" rel="noopener noreferrer">利用規約</a>
        <a href="/privacy" className="link" target="_blank" rel="noopener noreferrer">プライバシーポリシー</a>
      </div>
      <div className="icons">
        <a href="https://x.com/michihiro721" className="iconLink" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="icon" />
        </a>
        <a href="https://github.com/michihiro721/" className="iconLink" target="_blank" rel="noopener noreferrer">
          <FaGithub className="icon" />
        </a>
      </div>
      <div className="copy">
        &copy; 2025 - ver.1.00
      </div>
    </footer>
  );
}

// Footerコンポーネントをエクスポート
export default Footer;
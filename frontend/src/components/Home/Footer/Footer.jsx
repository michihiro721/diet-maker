// このコードは、ウェブサイトのフッターを表示するためのコンポーネントです。
// フッターには、リンクとソーシャルメディアのアイコンが含まれています。

import React from 'react'; // Reactをインポート
import { FaTwitter, FaGithub } from 'react-icons/fa'; // react-iconsからFaTwitterとFaGithubをインポート
import './Footer.css'; // CSSファイルをインポート

// Footerコンポーネントを定義
function Footer() {
  return (
    <footer className="footer">
      <div className="links">
        {/* お問い合わせ、利用規約、プライバシーポリシーのリンクを表示 */}
        <a href="/contact" className="link" target="_blank" rel="noopener noreferrer">お問い合わせ</a>
        <a href="/terms" className="link" target="_blank" rel="noopener noreferrer">利用規約</a>
        <a href="/privacy" className="link" target="_blank" rel="noopener noreferrer">プライバシーポリシー</a>
      </div>
      <div className="icons">
        {/* TwitterとGitHubのアイコンを表示 */}
        <a href="https://x.com/michihiro721" className="iconLink" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="icon" />
        </a>
        <a href="https://github.com/michihiro721/" className="iconLink" target="_blank" rel="noopener noreferrer">
          <FaGithub className="icon" />
        </a>
        {/* コピーライト情報を表示 */}
        <span className="copy">© 2025 - ver.1.00</span>
      </div>
    </footer>
  );
}

// Footerコンポーネントをエクスポート
export default Footer;
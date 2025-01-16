import React from 'react';
import { FaTwitter, FaGithub } from 'react-icons/fa';

// Footerコンポーネントを定義
function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.links}>
        <a href="https://twitter.com" style={styles.link}>Twitter</a>
        <a href="https://github.com" style={styles.link}>GitHub</a>
      </div>
      <div style={styles.icons}>
        <FaTwitter style={styles.icon} />
        <FaGithub style={styles.icon} />
      </div>
      <div style={styles.copy}>
        &copy; 2023 Diet Maker
      </div>
    </footer>
  );
}

// スタイルオブジェクトを定義
const styles = {
  footer: {
    backgroundColor: '#333',
    color: 'white',
    textAlign: 'center',
    padding: '20px 0',
    position: 'fixed',
    bottom: 0,
    width: '100%',
  },
  links: {
    marginBottom: '10px',
  },
  link: {
    color: 'white',
    margin: '0 15px',
    textDecoration: 'none',
  },
  icons: {
    marginBottom: '10px',
  },
  icon: {
    color: 'white',
    margin: '0 10px',
    fontSize: '20px',
  },
  copy: {
    fontSize: '14px',
  },
};

// Footerコンポーネントをエクスポート
export default Footer;
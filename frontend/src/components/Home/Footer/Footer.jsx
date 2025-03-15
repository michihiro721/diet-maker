// このコードは、ウェブサイトのフッターを表示するためのコンポーネントです。
// フッターには、ホーム画面、体重、カロリー関係、成果、みんなの投稿のリンクが含まれています。

import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaWeight, FaFire, FaTrophy, FaUsers } from 'react-icons/fa';
import './Footer.css';

// Footerコンポーネントを定義
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* 体重のリンク */}
        <Link to="/weight" className="footer-nav-item">
          <FaWeight className="footer-icon" />
          <span>体重</span>
        </Link>
        
        {/* カロリー関係のリンク */}
        <Link to="/calorie-info" className="footer-nav-item">
          <FaFire className="footer-icon" />
          <span>カロリー</span>
        </Link>
        
        {/* ホーム画面のリンク */}
        <Link to="/" className="footer-nav-item">
          <FaHome className="footer-icon" />
          <span>ホーム</span>
        </Link>
        
        {/* 成果のリンク */}
        <Link to="/achievements" className="footer-nav-item">
          <FaTrophy className="footer-icon" />
          <span>成果</span>
        </Link>
        
        {/* みんなの投稿一覧のリンク */}
        <Link to="/posts" className="footer-nav-item">
          <FaUsers className="footer-icon" />
          <span>投稿一覧</span>
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
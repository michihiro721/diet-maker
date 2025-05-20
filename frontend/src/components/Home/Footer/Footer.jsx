import React from 'react';
import { Link } from 'react-router-dom';
import { FaDumbbell, FaWeight, FaFire, FaTrophy, FaUsers } from 'react-icons/fa';
import './Footer.css';

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
        
        {/* トレーニング画面のリンク */}
        <Link to="/" className="footer-nav-item">
          <FaDumbbell className="footer-icon" />
          <span>トレーニング</span>
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
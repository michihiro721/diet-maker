import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaDumbbell,
  FaWeight,
  FaTrophy,
  FaUsers,
  FaArrowRight,
  FaSignInAlt,
  FaAppleAlt,
  FaRunning
} from 'react-icons/fa';
import './Footer.css';

function Footer() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/' && !localStorage.getItem('userId')) {
      const timer = setTimeout(() => setShowModal(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowModal(false);
    }
  }, [location.pathname]);

  const handleNavigation = (path) => {
    setShowModal(false);
    navigate(path);
  };

  return (
    <>
      {showModal && (
        <div className="welcome-modal-overlay welcome-modal">
          <div className="welcome-modal-content">
            <div className="welcome-animation">
              <div className="icon-circle">
                {/* 体重アイコン */}
                <FaWeight className="animated-icon weight-icon" />
                {/* 食事アイコン */}
                <FaAppleAlt className="animated-icon apple-icon" />
                {/* トレーニングアイコン */}
                <FaDumbbell className="animated-icon dumbbell-orbit-icon" />
                {/* ランニングアイコン */}
                <FaRunning className="animated-icon running-icon" />
                {/* ダンベルのロゴ */}
                <div className="diet-maker-logo">
                  <FaDumbbell className="dumbbell-icon" />
                </div>
              </div>
            </div>
            <h2>「ダイエットメーカー」をご利用頂き<br />ありがとうございます！</h2>
            <h3>アプリの使い方を確認しますか？</h3>
            <p className="welcome-description">
              簡単な使い方ガイドを見て、<br />アプリの機能を最大限に活用しましょう✨
            </p>
            <div className="welcome-modal-buttons">
              <button
                onClick={() => handleNavigation('/app-usage')}
                className="btn-primary"
              >
                確認する <FaArrowRight />
              </button>
              <button
                onClick={() => setShowModal(false)} 
                className="btn-secondary"
              >
                あとで
              </button>
            </div>
            <div className="login-button-container">
              <button
                onClick={() => handleNavigation('/login')}
                className="btn-login"
              >
                <FaSignInAlt /> ログインする
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="footer-content">
          {/* 体重のリンク */}
          <Link to="/weight" className="footer-nav-item">
            <FaWeight className="footer-icon" />
            <span>体重</span>
          </Link>

          {/* カロリー関係のリンク */}
          <Link to="/calorie-info" className="footer-nav-item">
            <FaAppleAlt className="footer-icon" />
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
    </>
  );
}

export default Footer;
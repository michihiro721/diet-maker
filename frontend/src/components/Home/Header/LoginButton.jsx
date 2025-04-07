import React, { useState, useEffect } from "react";
import LoginModal from "./LoginModal";
import "./styles/LoginButton.css";

const LoginButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  const checkLoginStatus = () => {
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(userId !== null);
  };

  useEffect(() => {
    checkLoginStatus();

    window.addEventListener('storage', checkLoginStatus);

    window.addEventListener('loginStateChanged', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('loginStateChanged', checkLoginStatus);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div>
      <button
        className="header-login-button"
        onClick={toggleMenu}
      >
        <i className={`fa-solid fa-user ${isLoggedIn ? 'user-logged-in' : ''}`}></i>
      </button>
      {isMenuOpen && <LoginModal closeMenu={closeMenu} />}
    </div>
  );
};

export default LoginButton;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import "./styles/LoginButton.css";

const LoginButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div>
      <button className="header-login-button" onClick={toggleMenu}>
      <i class="fa-solid fa-user"></i>
      </button>
      {isMenuOpen && <LoginModal closeMenu={closeMenu} />}
    </div>
  );
};

export default LoginButton;
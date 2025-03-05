import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/header.css";

const LoginButton = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

return (
    <button className="header-login-button" onClick={goToLogin}>
        <i class="fa-solid fa-circle-user"></i>
    </button>
);
};

export default LoginButton;
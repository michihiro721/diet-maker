import React from "react";
import "./styles/MenuButton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";


const MenuButton = ({ toggleMenu }) => {
  return (
    <button className="header-menu-button" onClick={toggleMenu}>
      <FontAwesomeIcon icon={faBars} />
    </button>
  );
};

// MenuButtonコンポーネントをエクスポート
export default MenuButton;
import React from "react";
import PropTypes from 'prop-types';
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


MenuButton.propTypes = {
  toggleMenu: PropTypes.func.isRequired
};


export default MenuButton;
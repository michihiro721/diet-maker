import React from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import "./styles/MenuModal.css";

const MenuModal = ({ closeMenu }) => {
  return (
    <div className="header-menu-overlay" onClick={closeMenu}>
      <div className="header-menu-modal" onClick={(e) => e.stopPropagation()}>
        <ul className="header-menu-list">
          <li><Link to="/goal-setting" onClick={closeMenu}>目標設定</Link></li>
          <li><Link to="/training-menu" onClick={closeMenu}>トレーニングメニュー提案</Link></li>
          <li><Link to="/body-info" onClick={closeMenu}>身体情報</Link></li>
          <li><Link to="/diet-mindset" onClick={closeMenu}>ダイエット心構え</Link></li>
          <li><Link to="/app-usage" onClick={closeMenu}>アプリ使い方</Link></li>
        </ul>
        <button className="header-close-button" onClick={closeMenu}>
          閉じる
        </button>
      </div>
    </div>
  );
};


MenuModal.propTypes = {
  closeMenu: PropTypes.func.isRequired
};

export default MenuModal;
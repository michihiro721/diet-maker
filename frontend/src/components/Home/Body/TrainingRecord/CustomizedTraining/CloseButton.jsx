import React from "react";
import PropTypes from 'prop-types';
import './styles/CloseButton.css';

const CloseButton = ({ closeModal }) => {
  return (
    <button className="close-button" onClick={closeModal}>
      閉じる
    </button>
  );
};


CloseButton.propTypes = {
  closeModal: PropTypes.func.isRequired
};

export default CloseButton;
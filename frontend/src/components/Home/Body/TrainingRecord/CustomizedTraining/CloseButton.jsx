import React from "react";
import './styles/CloseButton.css';

const CloseButton = ({ closeModal }) => {
  return (
    <button className="close-button" onClick={closeModal}>
      閉じる
    </button>
  );
};

export default CloseButton;
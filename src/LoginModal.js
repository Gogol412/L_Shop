import React from "react";
import "./style.css";

export const LoginModal = ({ isOpen, onClose, onRegisterClick, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="screen-modal">
          <div className="text-wrapper">Вход</div>

          <input
            className="text-normal-instance"
            type="text"
            placeholder="Логин"
          />
          <input
            className="text-normal-2"
            type="password"
            placeholder="Пароль"
          />

          <div className="frame-button">
            <div className="div">Вход</div>
          </div>

          <p className="p-signup">
            <span className="span">Нет аккаунта? </span>
            <span className="text-wrapper-2" onClick={onRegisterClick}>Создайте</span>
            <span className="span">!</span>
          </p>
          {children}
        </div>
      </div>
    </div>
  );
};
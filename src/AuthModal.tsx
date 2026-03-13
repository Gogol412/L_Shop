import React from "react";
import "./style.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="screen-modal">
          <div className="text-wrapper">Регистрация</div>

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
            <div className="div">Регистрация</div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
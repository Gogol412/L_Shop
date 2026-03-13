import React, { ReactNode } from "react";
import { TextNormal } from "./TextNormal";
import "./style.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export const AuthModal = ({ isOpen, onClose, children }: AuthModalProps): JSX.Element | null => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
        <div className="screen-modal">
          <div className="text-wrapper">Регистрация</div>

          <TextNormal
            className="text-normal-instance"
            divClassName="design-component-instance-node"
            prop="Логин"
          />
          <TextNormal
            className="text-normal-2"
            divClassName="text-normal-3"
            prop="Пароль"
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
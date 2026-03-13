import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../style.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onRegisterClick,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="screen-modal">
          <div className="text-wrapper">Вход</div>
          {error && (
            <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
          )}
          <form onSubmit={handleSubmit}>
            <input
              className="text-normal-instance"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="text-normal-2"
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="frame-button"
              style={{ width: '100%', border: 'none' }}
            >
              <div className="div">Вход</div>
            </button>
          </form>
          <p className="p-signup">
            <span className="span">Нет аккаунта? </span>
            <span className="text-wrapper-2" onClick={onRegisterClick}>
              Создайте
            </span>
            <span className="span">!</span>
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../style.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="screen-modal">
          <div className="text-wrapper">Регистрация</div>
          {error && (
            <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
          )}
          <form onSubmit={handleSubmit}>
            <input
              className="text-normal-instance"
              type="text"
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="text-normal-2"
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
              <div className="div">Зарегистрироваться</div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav style={{ display: 'flex', gap: '20px', padding: '10px', background: '#f0f0f0' }}>
            <Link to="/">Главная</Link>
            <Link to="/catalog">Каталог</Link>
            {user ? (
                <>
                    <span>Привет, {user.name}!</span>
                    <button onClick={logout}>Выйти</button>
                </>
            ) : (
                <>
                    <Link to="/login">Вход</Link>
                    <Link to="/register">Регистрация</Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;
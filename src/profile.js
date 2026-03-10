import React from 'react';
import "./style.css";
import { Link } from 'react-router-dom';

const Profile = () => {
  return (
    <>
    <div className="Catalog">
        <Link to="/catalog" style={{ textDecoration: 'none', color: 'inherit' }}>
            <p>Каталог</p>
        </Link>
    </div>

    <div className='CakesP'>
        <p>Cakes</p>
    </div>

    <div className='ProfileBlock'>
        <p>Имя Фамилия</p>
        <span>+375 (00) 000-00-00</span>
    </div>

    </>
  );
};

export default Profile;
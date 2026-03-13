import React from 'react';
import "./style.css";
import { Link } from 'react-router-dom';
import cupcake from "./Капкейки.jpg";
import cheescake from "./Чизкейки.jpg";

const Profile = () => {
  const profileProducts = [
    { id: 1, name: "Капкейки", price: "50 BYN/10 шт.", image: cupcake },
    { id: 2, name: "Чизкейки", price: "55 BYN/8 шт.", image: cheescake },
    { id: 3, name: "Капкейки", price: "50 BYN/10 шт.", image: cupcake },
    { id: 4, name: "Чизкейки", price: "55 BYN/8 шт.", image: cheescake },
  ];

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

      <div className='DiscountBlock'>
        <p>Скидка</p>
        <span>До 50%</span>
      </div>

      <div className='SumOfDeserts'>
        <p>Сумма вашей корзины</p>
        <span>1200 BYN</span>
      </div>

      <div className='YourBuyings'>
        <p>Корзина</p>
      </div>

      <div className="profile-grid">
        {profileProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-name">{product.name}</div>
            <div className="product-price">{product.price}</div>
            <div className="product-button">В корзину</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Profile;
import React from 'react';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { Link } from 'react-router-dom';
import './style.css';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { cart, loading, removeFromCart, updateQuantity } = useCart();

  if (!user) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        Вы не авторизованы. <Link to="/">На главную</Link>
      </div>
    );
  }

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <>
      <div className="Catalog">
        <Link
          to="/catalog"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <p>Каталог</p>
        </Link>
      </div>

      <div className="CakesP">
        <p>Cakes</p>
      </div>

      <div className="ProfileBlock">
        <p>{user.name}</p>
        <span>{user.email}</span>
      </div>

      <div className="DiscountBlock">
        <p>Скидка</p>
        <span>До 50%</span>
      </div>

      <div className="SumOfDeserts">
        <p>Сумма вашей корзины</p>
        <span>{totalPrice} BYN</span>
      </div>

      <div className="YourBuyings">
        <p>Корзина</p>
      </div>

      <div className="profile-grid">
        {loading ? (
          <div>Загрузка корзины...</div>
        ) : cart.length === 0 ? (
          <div>Корзина пуста</div>
        ) : (
          cart.map((item) => (
            <div key={item.productId} className="product-card">
              <div className="product-image">
                <img src={item.image || '/default.jpg'} alt={item.name} />
              </div>
              <div className="product-name">{item.name}</div>
              <div className="product-price">
                {item.price} BYN x {item.quantity} ={' '}
                {item.price * item.quantity} BYN
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'center',
                }}
              >
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity - 1)
                  }
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity + 1)
                  }
                >
                  +
                </button>
                <button onClick={() => removeFromCart(item.productId)}>
                  Удалить
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={logout}
        style={{ position: 'fixed', bottom: 20, right: 20 }}
      >
        Выйти
      </button>
    </>
  );
};

export default Profile;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./style.css";
import mainImage from "./Главная.jpg";
import dopImage from "./Картиночка.jpg";
import cupcake from "./Капкейки.jpg";
import cheescake from "./Чизкейки.jpg";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка загрузки товаров');
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const popularProducts = products.slice(0, 2);
  // const popularProducts = products.filter(p => p.popular).slice(0, 2);

  // Пока загружаются данные, можно показать заглушку
  if (loading) {
    return (
      <>
        {/* Можно оставить основную структуру, но вместо товаров показать скелетон */}
        <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div>
      </>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        Ошибка загрузки: {error}
      </div>
    );
  }

  return (
    <>
      <div className="Katalog">
        <Link to="/catalog" style={{ textDecoration: 'none', color: 'inherit' }}>
          <p>Каталог</p>
        </Link>
      </div>

      <div className="Cakes">
        <p>Cakes</p>
      </div>

      <div className="MainPic">
        <img src={mainImage} alt="Главная" />
      </div>

      <div className="MainTextOnPic">
        <p>Попробуйте тот самый <br />секретный ингредиент счастья!</p>
      </div>

      <div className="DopTextOnPic">
        <p>
          Cakes — место, где рождаются настоящие кулинарные <br />
          шедевры полные вдохновения и любви к своему делу. Мы создали этот уголок <br />
          специально для тех, кто хочет окунуться в мир изысканных вкусов,<br />
          незабываемых ароматов и неповторимых эмоций.<br />
          Мы делаем каждый десерт уникальным, наполняя его особой магией.
        </p>
      </div>

      <div className="KatalogButton">
        <Link to="/catalog" style={{ textDecoration: 'none', color: 'inherit' }}>
          <p>Посмотреть каталог</p>
        </Link>
      </div>

      <div className="CakesIt">
        <p>Cakes – это...</p>
      </div>

      <div className="BlockWithTeam">
        <p>
          Команда профессиональных кондитеров, которая <br />
          воплотила мечту о создании настоящей кондитерской <br />
          мастерской, где каждый продукт готовится вручную,<br />
          бережно сохраняя индивидуальность и особую <br />
          атмосферу домашнего тепла <br /> <br />
          Каждый кусочек тортика, каждая крошка печенья <br />
          несёт частичку души мастера, прошедшего долгий <br />
          путь от традиционного ремесла до <br />
          современных тенденций.
        </p>
      </div>

      <div className="BlockWithIngridients">
        <p>
          Мы выбираем натуральные ингредиенты, следуя <br />
          принципам здорового питания и экологической<br />
          ответственности. <br /> <br />
          Вдохновение рождается там, где встречается любовь <br />
          к делу и страсть к созданию уникальных блюд.
        </p>
      </div>

      <div className="PictureFor2Blocks">
        <img src={dopImage} alt="desert" />
      </div>

      <div className="PopularTov">
        <p>Популярные товары</p>
      </div>

      <div className="popular-grid">
        {popularProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {/* Если в JSON есть поле image, используем его, иначе заглушку */}
              <img
                src={product.image || (product.name === 'Капкейки' ? cupcake : cheescake)}
                alt={product.name}
              />
            </div>
            <div className="product-name">{product.name}</div>
            <div className="product-price">
              {product.price} BYN / {product.count} шт.
            </div>
            <div className="product-button">В корзину</div>
          </div>
        ))}
      </div>

      {/* Далее ваш остальной код без изменений */}
      <div className="HowToBuyBlock"></div>
      <div className="HowToBuyText">
        <p>Как заказать</p>
      </div>
      <div className="HowToBuyDopText">
        <p>
          Если вы предпочитаете личное посещение магазина,<br />
          приходите в любое удобное время: сотрудники расскажут<br />
          обо всех особенностях выбора, помогут оформить<br />
          индивидуальный заказ и предложат напитки <br />
          для дегустации.
        </p>
      </div>
      <div className="HowToBuyBlockPoint1">
        <p>1</p>
      </div>
      <div className="HowToBuyBlockPoint1Text">
        <p>
          Изучите наш подробный каталог, выбрав<br />
          категорию интересующего продукта.
        </p>
      </div>
      <div className="HowToBuyBlockPoint2">
        <p>2</p>
      </div>
      <div className="HowToBuyBlockPoint2Text">
        <p>
          Добавьте выбранные товары в корзину, указав <br />
          необходимое количество.
        </p>
      </div>
      <div className="HowToBuyBlockPoint3">
        <p>3</p>
      </div>
      <div className="HowToBuyBlockPoint3Text">
        <p>
          Оформите заявку, заполнив простую анкету<br />
          с контактными данными.
        </p>
      </div>
      <div className="HowToBuyBlockPoint4">
        <p>4</p>
      </div>
      <div className="HowToBuyBlockPoint4Text">
        <p>
          После подтверждения оплаты курьер <br />
          доставит ваш заказ точно в срок.
        </p>
      </div>
      <div className="ButtonChooseDesert">
        <Link to="/catalog" style={{ textDecoration: 'none', color: 'inherit' }}></Link>
        <p>Выбрать десерт</p>
      </div>
      <div className="ToProfile">
        <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
          <p>☺</p>
        </Link>
      </div>
    </>
  );
};

export default Home;
import React, { useState, useEffect } from 'react';
import "./style.css";
import { Link } from 'react-router-dom';

import cupcake from "./Капкейки.jpg";
import cheescake from "./Чизкейки.jpg";

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Запрашиваем данные с бэкенда
    fetch('http://localhost:5000/api/products')
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка загрузки');
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

  // Пока грузятся данные
  if (loading) {
    return (
      <>
        <div className="NavBar">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <p>Cakes</p>
          </Link>
        </div>
        <div className="Find">
          <p>🔍 Поиск</p>
        </div>
        <div className="ForYou">
          <p>Подборка для вас</p>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div>
      </>
    );
  }

  // Если ошибка
  if (error) {
    return (
      <>
        <div className="NavBar">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <p>Cakes</p>
          </Link>
        </div>
        <div className="Find">
          <p>🔍 Поиск</p>
        </div>
        <div className="ForYou">
          <p>Подборка для вас</p>
        </div>
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          Ошибка: {error}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="NavBar">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <p>Cakes</p>
        </Link>
      </div>
      <div className="Find">
        <p>🔍 Поиск</p>
      </div>
      <div className="ForYou">
        <p>Подборка для вас</p>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {/* Тут нужно решить вопрос с картинками */}
              <img src={product.image || cupcake} alt={product.name} />
            </div>
            <div className="product-name">{product.name}</div>
            <div className="product-price">
              {product.price} BYN/{product.count} шт.
            </div>
            <div className="product-button">В корзину</div>
          </div>
        ))}
      </div>
      <div className="ToProfile1">
        <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
          <p>☺</p>
        </Link>
      </div>
    </>
  );
};

export default CatalogPage;
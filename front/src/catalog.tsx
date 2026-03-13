import React, { useState, useEffect } from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import { useCart } from './context/CartContext'; // <-- добавили импорт

import cupcake from './Капкейки.jpg';
import cheescake from './Чизкейки.jpg';

interface Product {
  id: number;
  name: string;
  price: number;
  count: number;
  image?: string;
}

const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useCart(); // <-- получаем функцию добавления

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ошибка загрузки');
        }
        return response.json() as Promise<Product[]>;
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error('Ошибка:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Неизвестная ошибка');
        }
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (productId: number) => {
    addToCart(productId); // добавляем товар с количеством 1
  };

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
        {products.map((product: Product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image || cupcake} alt={product.name} />
            </div>
            <div className="product-name">{product.name}</div>
            <div className="product-price">
              {product.price} BYN/{product.count} шт.
            </div>
            <div
              className="product-button"
              onClick={() => handleAddToCart(product.id)} // <-- добавили обработчик
            >
              В корзину
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CatalogPage;

import React from 'react';
import "./style.css";
import { Link } from 'react-router-dom';
import cupcake from "./Капкейки.jpg";
import cheescake from "./Чизкейки.jpg";

const CatalogPage = () => {
  const products = [
    { id: 1, name: "Капкейки", price: "50 BYN/10 шт.", image: cupcake },
    { id: 2, name: "Чизкейки", price: "55 BYN/8 шт.", image: cheescake },
    { id: 3, name: "Капкейки", price: "50 BYN/10 шт.", image: cupcake },
    { id: 4, name: "Чизкейки", price: "55 BYN/8 шт.", image: cheescake },
    { id: 5, name: "Капкейки", price: "50 BYN/10 шт.", image: cupcake },
    { id: 6, name: "Чизкейки", price: "55 BYN/8 шт.", image: cheescake },
    { id: 7, name: "Капкейки", price: "50 BYN/10 шт.", image: cupcake },
    { id: 8, name: "Чизкейки", price: "55 BYN/8 шт.", image: cheescake },
    { id: 9, name: "Капкейки", price: "50 BYN/10 шт.", image: cupcake },
    { id: 10, name: "Чизкейки", price: "55 BYN/8 шт.", image: cheescake },
    { id: 11, name: "Капкейки", price: "50 BYN/10 шт.", image: cupcake },
    { id: 12, name: "Чизкейки", price: "55 BYN/8 шт.", image: cheescake },
  ];

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
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-name">{product.name}</div>
            <div className="product-price">{product.price}</div>
            <div className="product-button">В корзину</div>
          </div>
        ))}
      </div>
      <div className = "ToProfile1">
            <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
            <p>☺</p>
            </Link>
            </div>
    </>
  );
};

export default CatalogPage;
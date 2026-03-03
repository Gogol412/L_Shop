import "./style.css";
import mainImage from "./Главная.jpg";
import dopImage from "./Картиночка.jpg";
import cupcake from "./Капкейки.jpg";
import cheescake from "./Чизкейки.jpg";
function App() {
  return (
    <>
      <div className="Katalog">
        <p>Каталог</p>
      </div>
      <div className="Cakes">
        <p>Cakes</p>
      </div>
      <div className = "MainPic">
         <img src={mainImage} alt="Главная" /> 
      </div>
     <div className = "MainTextOnPic">
      <p>Попробуйте тот самый <br></br>секретный ингридиент счастья!</p>
     </div>
      <div className = "DopTextOnPic">
      <p>Cakes — место, где рождаются настоящие кулинарные <br></br>шедевры полные вдохновления и любви к своему делу. Мы создали этот уголок <br></br>специально для тех, кто хочет окунуться в мир изысканных вкусов,<br></br>незабываемых ароматов и неповторимых эмоций.<br></br>
Мы делаем каждый десерт уникальным, наполняя его особой магией.</p>
     </div>
     <div className = "KatalogButton">
      <p>Посмотреть каталог</p>
     </div>
      <div className = "CakesIt">
        <p>Cakes – это...</p>
      </div>
      <div className = "BlockWithTeam">
        <p> Команда профессиональных кондитеров, которая <br></br>воплотила мечту о создании настоящей кондитерской <br></br>мастерской, где каждый продукт готовится вручную,<br></br> бережно сохраняя индивидуальность и особую<br></br> атмосферу домашнего тепла <br></br> <br></br>
            Каждый кусочек тортика, каждая крошка печенья <br></br>несёт частичку души мастера, прошедшего долгий <br></br>путь от традиционного ремесла до <br></br>современных тенденций.</p>
      </div>
      <div className = "BlockWithIngridients">
        <p>Мы выбираем натуральные ингредиенты, следуя <br></br>принципам здорового питания и экологической<br></br>ответственности. <br></br> <br></br>
           Вдохновение рождается там, где встречается любовь <br></br> к делу и страсть к созданию уникальных блюд.</p>
      </div>
      <div className = "PictureFor2Blocks">
         <img src={dopImage} alt="desert" /> 
      </div>
      <div className = "PopularTov">
        <p>Популярные товары</p>
      </div>
      <div className="fordownload">
        1
      </div>
      <div className="ButtonPrev1">
        <p> ←</p>
      </div>
      <div className="ButtonNext1">
        <p>→</p>
      </div>
      <div className="Cupcakes">
     <img src={cupcake} alt="desert" /> 
      </div>
      <div className="CupCakesText">
        <p>Капкейки</p>
      </div>

##################################################

      <div className="CupCakesPrice">

      </div>

      <div className="Cheescakes">
     <img src={cheescake} alt="desert" /> 
      </div>
      <div className="ButtonBuy">
        <p>Заказать</p>
      </div>
      <div className="ButtonBuy2">
        <p>Заказать</p>
      </div>
    </>
  );
}

export default App;
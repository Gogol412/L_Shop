import React, { useState, useRef } from 'react';
import { TextNormal } from "./TextNormal";
import "./style.css";
import { JSX } from 'react/jsx-runtime';
import image2 from "./image.svg";
import avatar from "./Avatar.svg";
import instagramLogo from "./InstagramLogo.svg";
import telegramLogo from "./TelegramLogo.svg";
import galca from "./CaretDown.jpg";

export const Screen = (): JSX.Element => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = (buttonName: string) => {
    alert(`Кнопка "${buttonName}" нажата!`);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };

  return (
    <div className="screen">
      <div className="view">
        <div className="div-wrapper" onClick={() => handleButtonClick("Отчет")}>
          <div className="text-wrapper"> Отчет</div>
        </div>

        <div className="div">Cakes</div>

        <div className="header-icons">
          <img src={instagramLogo} className="header-icon" />
          <img src={telegramLogo} className="header-icon" />
          <img src={avatar} className="image" />
        </div>

      </div>

      <div className="text-wrapper-2">Добавление товара</div>

      <div className="frame" onClick={handleImageClick}>
        <img src={selectedImage || image2} className="vector" />
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*"
      />

      <TextNormal
        className="text-normal-instance"
        divClassName="design-component-instance-node"
        prop="Цена"
      />
      <TextNormal
        className="text-normal-2"
        divClassName="text-normal-3"
        prop="Название"
      />
      <TextNormal
        className="text-normal-4"
        divClassName="text-normal-5"
        prop="Логин"
      />
      <TextNormal
        className="text-normal-6"
        divClassName="text-normal-7"
        prop="Пароль"
      />
      <div className="text-wrapper-3">Добавить кондитера</div>

      <div className="frame-2" onClick={() => handleButtonClick("Добавить кондитера")}>
        <div className="text-wrapper-4">Добавить кондитера</div>
      </div>

      <TextNormal
        className="text-normal-8"
        divClassName="text-normal-9"
        prop="Номер заказа"
      />
      <div className="frame-3" onClick={() => handleButtonClick("Удалить заказ")}>
        <div className="text-wrapper-4">Удалить заказ</div>
      </div>

      <div className="text-normal-10">
        <select className="text-normal-11">
          <option value="">Выберите кондитера</option>
          <option value="Иванов Иван">Иванов Иван</option>
          <option value="Петров Петр">Петров Петр</option>
          <option value="Сидоров Сидор">Сидоров Сидор</option>
          <option value="Кузнецова Анна">Кузнецова Анна</option>
        </select>
      </div>
      <div className="text-wrapper-5">Удалить кондитера</div>

      <div className="frame-4" onClick={() => handleButtonClick("Удалить кондитера")}>
        <div className="text-wrapper-4">Удалить кондитера</div>
      </div>

      <div className="caret-down">
        <img src={instagramLogo} className="img" />

      </div>

      <div className="text-wrapper-6">Удалить заказ</div>

      <div className="view-2">
        <div className="view-3">
          <div className="text-wrapper-7">Cakes</div>

          <div className="text-wrapper-8">Ⓒ Все права защищены.</div>
        </div>

        <div className="view-4">
          <div className="vector-wrapper">
            <img src={instagramLogo} className="vector-3" />
          </div>

          <div className="vector-wrapper">
            <img src={telegramLogo} className="vector-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

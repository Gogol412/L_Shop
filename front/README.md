# L_Shop Frontend

Frontend интернет-магазина Cakes написан на React.

## Установка

```powershell
cd "C:\Users\User\OneDrive\Desktop\учеба\JS\L_Shop\front"
npm.cmd install
```

## Запуск

Перед запуском фронта должен быть запущен backend на `http://localhost:5000`.

```powershell
npm.cmd start
```

Адрес приложения:

```text
http://localhost:3000
```

## Проверка

Тесты:

```powershell
npm.cmd test -- --watchAll=false
```

Production-сборка:

```powershell
npm.cmd run build
```

## Что есть на фронте

- главная страница;
- каталог товаров;
- карточка товара с отзывами;
- лайк товара для рекомендаций;
- регистрация и вход;
- выход из аккаунта;
- выбор языка `ru/en`;
- админ-страница для создания и редактирования товаров.

Для входа администратора используйте:

```text
admin / admin123
```

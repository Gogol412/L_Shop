# L_Shop API

Backend интернет-магазина Cakes написан на Express и TypeScript. Данные хранятся в JSON-файлах в папке `database`.

## Установка

```powershell
cd "C:\Users\User\OneDrive\Desktop\учеба\JS\L_Shop\back"
npm.cmd install
```

Используйте именно `npm.cmd`, если PowerShell блокирует обычный `npm`.

## Запуск

```powershell
npm.cmd start
```

Команда сначала собирает TypeScript в папку `build`, затем запускает сервер.

Адрес backend:

```text
http://localhost:5000
```

Проверка:

```powershell
Invoke-RestMethod -Uri http://localhost:5000/api/health
```

Ожидаемый ответ:

```json
{
  "status": "ok"
}
```

## Тесты

```powershell
npm.cmd test
```

Тесты покрывают:

- локализацию товаров;
- сессионную cookie;
- рекомендации по тегам;
- авторизацию;
- запрет отзывов для гостей;
- создание отзывов пользователем;
- запрет админских методов для обычного пользователя;
- создание и редактирование товара админом;
- utility-функции рейтингов и рекомендаций.

## Тестовые пользователи

Администратор:

```text
login: admin
password: admin123
```

Обычный пользователь:

```text
login: user
password: user123
```

## Сессии и роли

Используется сессионная cookie `shop_session`. Она не имеет долгого срока хранения и должна сбрасываться после завершения браузерной сессии.

Роли:

- `guest` - гость, может смотреть каталог и лайкать товары;
- `user` - пользователь, может оставлять отзывы и оценки;
- `admin` - администратор, может создавать и редактировать товары.

Админская сессия ограничена 30 минутами.

## API

- `GET /api/health` - проверка работы сервера.
- `GET /api/auth/me` - текущий пользователь.
- `POST /api/auth/register` - регистрация.
- `POST /api/auth/login` - вход.
- `POST /api/auth/logout` - выход.
- `GET /api/session/locale` - текущая локаль.
- `POST /api/session/locale` - установить локаль `ru` или `en`.
- `GET /api/products` - каталог с рекомендациями.
- `GET /api/products/:id` - карточка товара с отзывами.
- `POST /api/products/:id/like` - добавить теги товара в рекомендации.
- `POST /api/products/:id/reviews` - оставить оценку и комментарий.
- `GET /api/admin/products` - товары для админки.
- `POST /api/admin/products` - создать товар.
- `PUT /api/admin/products/:id` - обновить товар.

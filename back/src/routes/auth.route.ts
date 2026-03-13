import { Router } from "express";
import fs from "fs/promises";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    createdAt: string;
}

const router = Router();

const usersFilePath = path.join(process.cwd(), "database/users.json");

// Секретный ключ для JWT
const JWT_SECRET = "your-secret-key-change-in-production";

const readUsers = async (): Promise<User[]> => {
    try {
        const data = await fs.readFile(usersFilePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeUsers = async (users: any[]) => {
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
};

// Регистрация
router.post("/register", async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: "Все поля обязательны" });
        }

        const users = await readUsers() as User[]

        // Проверка, существует ли пользователь
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ message: "Пользователь с таким email уже существует" });
        }

        // Хэширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создание нового пользователя
        const newUser = {
            id: Date.now().toString(),
            email,
            password: hashedPassword,
            name,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        await writeUsers(users);

        // Создание JWT токена
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Установка httpOnly куки
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // в production используйте HTTPS
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 дней
        });

        // Возвращаем данные пользователя (без пароля)
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// Вход
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email и пароль обязательны" });
        }

        const users = await readUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(401).json({ message: "Неверный email или пароль" });
        }

        // Проверка пароля
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Неверный email или пароль" });
        }

        // Создание токена
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// Выход
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Выход выполнен" });
});

// Получение информации о текущем пользователе (проверка токена)
router.get("/me", async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Не авторизован" });
        }

        // Проверка токена
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };

        const users = await readUsers() as User[];
        const user = users.find((u: User) => u.id === decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Пользователь не найден" });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Не авторизован" });
    }
});

export default router;
import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();
const usersFilePath = path.join(process.cwd(), 'database/users.json');
const JWT_SECRET = 'your-secret-key-change-in-production'; // в .env вынесите

interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    createdAt: string;
}

const readUsers = async (): Promise<User[]> => {
    try {
        const data = await fs.readFile(usersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
};

const writeUsers = async (users: User[]) => {
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
};

router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Все поля обязательны' });
        }

        const users = await readUsers();
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ message: 'Email уже используется' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser: User = {
            id: Date.now().toString(),
            email,
            password: hashedPassword,
            name,
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        await writeUsers(users);

        const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '10m' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 10 * 60 * 1000 // 10 минут
        });

        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email и пароль обязательны' });
        }

        const users = await readUsers();
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '10m' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 10 * 60 * 1000
        });

        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Выход выполнен' });
});

router.get('/me', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: 'Не авторизован' });

        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
        const users = await readUsers();
        const user = users.find(u => u.id === decoded.id);
        if (!user) return res.status(401).json({ message: 'Пользователь не найден' });

        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch {
        res.status(401).json({ message: 'Не авторизован' });
    }
});

export default router;
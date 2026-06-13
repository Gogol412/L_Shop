import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';

const router = Router();

const cartsFilePath = path.join(process.cwd(), 'database/carts.json');
const productsFilePath = path.join(process.cwd(), 'database/products.json');
const JWT_SECRET = 'your-secret-key-change-in-production';

async function readCarts(): Promise<Record<string, { productId: number; quantity: number }[]>> {
    try {
        const data = await fs.readFile(cartsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch {
        return {};
    }
}

async function writeCarts(carts: Record<string, any[]>) {
    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
}

async function readProducts(): Promise<any[]> {
    try {
        const data = await fs.readFile(productsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

const authMiddleware = async (req: any, res: any, next: any) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Не авторизован' });
        }
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
        req.userId = decoded.id; // добавляем userId в запрос
        next();
    } catch {
        return res.status(401).json({ message: 'Не авторизован' });
    }
};

router.get('/', authMiddleware, async (req: any, res) => {
    try {
        const userId = req.userId;
        const carts = await readCarts();
        const userCart = carts[userId] || [];

        const products = await readProducts();
        // Создаем Map для быстрого доступа по id
        const productsMap = new Map(products.map(p => [p.id, p]));

        const cartWithDetails = userCart.map(item => {
            const product = productsMap.get(item.productId);
            return {
                ...item,
                ...product, // добавляем поля name, price, image и т.д.
                quantity: item.quantity
            };
        });

        res.json(cartWithDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

router.post('/add', authMiddleware, async (req: any, res) => {
    try {
        const userId = req.userId;
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'productId обязателен' });
        }

        // Проверяем, существует ли такой товар
        const products = await readProducts();
        const productExists = products.some(p => p.id === productId);
        if (!productExists) {
            return res.status(404).json({ message: 'Товар не найден' });
        }

        const carts = await readCarts();
        if (!carts[userId]) {
            carts[userId] = [];
        }

        const existingItem = carts[userId].find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            carts[userId].push({ productId, quantity });
        }

        await writeCarts(carts);
        res.json({ message: 'Товар добавлен в корзину' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

router.delete('/remove/:productId', authMiddleware, async (req: any, res) => {
    try {
        const userId = req.userId;
        const productId = parseInt(req.params.productId);

        const carts = await readCarts();
        if (!carts[userId]) {
            return res.status(404).json({ message: 'Корзина пуста' });
        }

        carts[userId] = carts[userId].filter(item => item.productId !== productId);
        await writeCarts(carts);

        res.json({ message: 'Товар удалён из корзины' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

router.put('/update', authMiddleware, async (req: any, res) => {
    try {
        const userId = req.userId;
        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined) {
            return res.status(400).json({ message: 'productId и quantity обязательны' });
        }

        const carts = await readCarts();
        if (!carts[userId]) {
            return res.status(404).json({ message: 'Корзина пуста' });
        }

        const item = carts[userId].find(item => item.productId === productId);
        if (!item) {
            return res.status(404).json({ message: 'Товар не найден в корзине' });
        }

        if (quantity <= 0) {
            // удаляем, если количество стало 0 или меньше
            carts[userId] = carts[userId].filter(item => item.productId !== productId);
        } else {
            item.quantity = quantity;
        }

        await writeCarts(carts);
        res.json({ message: 'Количество обновлено' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

export default router;
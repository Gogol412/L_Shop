import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app: Application = express();

app.use(cors()); // Разрешаем запросы с других портов
app.use(express.json()); // Для парсинга JSON тела запросов

const DATA_FILE = path.join(__dirname, '../products.json');

app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const products = JSON.parse(data);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../front/build')));
  
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../front/build/index.html'));
  });
}
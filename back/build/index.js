import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
const app = express();
app.use(cors());
app.use(express.json());
const DATA_FILE = path.join(__dirname, '../products.json');
app.get('/api/products', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        const products = JSON.parse(data);
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to read data' });
    }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../front/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../front/build/index.html'));
    });
}
//# sourceMappingURL=index.js.map
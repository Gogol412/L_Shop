import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRoute from "./routes/products.route.js";
import authRoute from "./routes/auth.route.js";
import cartRoute from './routes/cart.route.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origin.startsWith('http://localhost:')) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/cart', cartRoute);
app.use("/api/products", productsRoute);
app.use("/api/auth", authRoute);
app.listen(PORT, () => {
    console.log(`🚀🚀🚀🚀🚀🚀 BACK running on http://localhost:${PORT} 🚀🚀🚀🚀🚀🚀`);
});
//# sourceMappingURL=index.js.map
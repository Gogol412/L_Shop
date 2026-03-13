import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRoute from "./routes/products.route.js";
import authRoute from "./routes/auth.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Роуты
app.use("/api/products", productsRoute);
app.use("/api/auth", authRoute);

app.listen(PORT, () => {
  console.log(`🚀🚀🚀🚀🚀🚀 BACK running on http://localhost:${PORT} 🚀🚀🚀🚀🚀🚀`);
});
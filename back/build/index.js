import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRoute from "./routes/products.route.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use("/api/products", productsRoute);
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 API available at http://localhost:${PORT}/api/products`);
});
//# sourceMappingURL=index.js.map
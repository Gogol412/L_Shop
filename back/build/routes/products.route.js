import { Router } from "express";
import fs from "fs";
import path from "path";
const router = Router();
const filePath = path.join(process.cwd(), "database/products.json");
const getProducts = () => {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
};
router.get("/", (req, res) => {
    const products = getProducts();
    res.json(products);
});
export default router;
//# sourceMappingURL=products.route.js.map
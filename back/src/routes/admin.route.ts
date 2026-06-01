import { NextFunction, Request, Response, Router } from "express";
import { nextId, readProducts, writeProducts } from "../lib/storage.js";
import { Product } from "../types.js";

const router = Router();

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.appSession.role !== "admin") {
    res.status(403).json({ message: "Admin role is required" });
    return;
  }

  next();
}

function sanitizeProduct(payload: Partial<Product>, id: number): Product {
  return {
    id,
    translations: {
      ru: {
        name: payload.translations?.ru?.name?.trim() ?? "",
        description: payload.translations?.ru?.description?.trim() ?? "",
      },
      en: {
        name: payload.translations?.en?.name?.trim() ?? "",
        description: payload.translations?.en?.description?.trim() ?? "",
      },
    },
    price: Number(payload.price),
    count: Number(payload.count),
    image: payload.image?.trim() || "cupcake",
    tags: Array.from(new Set((payload.tags ?? []).map((tag) => tag.trim()).filter(Boolean))),
  };
}

function validateProduct(product: Product): string | null {
  if (!product.translations.ru.name || !product.translations.en.name) {
    return "Russian and English names are required";
  }

  if (!Number.isFinite(product.price) || product.price <= 0) {
    return "Price must be greater than 0";
  }

  if (!Number.isInteger(product.count) || product.count < 0) {
    return "Count must be a non-negative integer";
  }

  if (product.tags.length === 0) {
    return "At least one tag is required";
  }

  return null;
}

router.use(requireAdmin);

router.get("/products", async (_req, res) => {
  const products = await readProducts();
  res.json(products);
});

router.post("/products", async (req, res) => {
  const products = await readProducts();
  const product = sanitizeProduct(req.body as Partial<Product>, nextId(products));
  const error = validateProduct(product);

  if (error) {
    res.status(400).json({ message: error });
    return;
  }

  products.push(product);
  await writeProducts(products);
  res.status(201).json(product);
});

router.put("/products/:id", async (req, res) => {
  const productId = Number(req.params.id);
  const products = await readProducts();
  const productIndex = products.findIndex((product) => product.id === productId);

  if (productIndex === -1) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  const product = sanitizeProduct(req.body as Partial<Product>, productId);
  const error = validateProduct(product);

  if (error) {
    res.status(400).json({ message: error });
    return;
  }

  products[productIndex] = product;
  await writeProducts(products);
  res.json(product);
});

export default router;

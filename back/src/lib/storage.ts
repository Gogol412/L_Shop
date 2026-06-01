import fs from "fs/promises";
import path from "path";
import { Product, Review, StoreData, User } from "../types.js";

const databaseDir = path.join(process.cwd(), "database");

const paths = {
  products: path.join(databaseDir, "products.json"),
  users: path.join(databaseDir, "users.json"),
  reviews: path.join(databaseDir, "reviews.json"),
};

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await writeJson(filePath, fallback);
      return fallback;
    }

    throw error;
  }
}

async function writeJson<T>(filePath: string, data: T): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}

export async function readProducts(): Promise<Product[]> {
  return readJson<Product[]>(paths.products, []);
}

export async function writeProducts(products: Product[]): Promise<void> {
  await writeJson(paths.products, products);
}

export async function readUsers(): Promise<User[]> {
  return readJson<User[]>(paths.users, []);
}

export async function writeUsers(users: User[]): Promise<void> {
  await writeJson(paths.users, users);
}

export async function readReviews(): Promise<Review[]> {
  return readJson<Review[]>(paths.reviews, []);
}

export async function writeReviews(reviews: Review[]): Promise<void> {
  await writeJson(paths.reviews, reviews);
}

export async function readStore(): Promise<StoreData> {
  const [products, users, reviews] = await Promise.all([
    readProducts(),
    readUsers(),
    readReviews(),
  ]);

  return { products, users, reviews };
}

export function nextId(items: { id: number }[]): number {
  return items.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;
}

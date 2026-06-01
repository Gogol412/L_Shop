import fs from "fs/promises";
import path from "path";
const databaseDir = path.join(process.cwd(), "database");
const paths = {
    products: path.join(databaseDir, "products.json"),
    users: path.join(databaseDir, "users.json"),
    reviews: path.join(databaseDir, "reviews.json"),
};
async function readJson(filePath, fallback) {
    try {
        const raw = await fs.readFile(filePath, "utf-8");
        return JSON.parse(raw);
    }
    catch (error) {
        if (error.code === "ENOENT") {
            await writeJson(filePath, fallback);
            return fallback;
        }
        throw error;
    }
}
async function writeJson(filePath, data) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}
export async function readProducts() {
    return readJson(paths.products, []);
}
export async function writeProducts(products) {
    await writeJson(paths.products, products);
}
export async function readUsers() {
    return readJson(paths.users, []);
}
export async function writeUsers(users) {
    await writeJson(paths.users, users);
}
export async function readReviews() {
    return readJson(paths.reviews, []);
}
export async function writeReviews(reviews) {
    await writeJson(paths.reviews, reviews);
}
export async function readStore() {
    const [products, users, reviews] = await Promise.all([
        readProducts(),
        readUsers(),
        readReviews(),
    ]);
    return { products, users, reviews };
}
export function nextId(items) {
    return items.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;
}
//# sourceMappingURL=storage.js.map
import fs from "fs/promises";
import path from "path";
import request from "supertest";
import { app } from "../build/index.js";
import { resetSessionsForTests } from "../build/middleware/session.js";

const databaseDir = path.join(process.cwd(), "database");
const files = ["products.json", "users.json", "reviews.json"];
let backup = {};

beforeAll(async () => {
  backup = Object.fromEntries(
    await Promise.all(
      files.map(async (file) => [file, await fs.readFile(path.join(databaseDir, file), "utf-8")]),
    ),
  );
});

beforeEach(() => {
  resetSessionsForTests();
});

afterEach(async () => {
  await Promise.all(
    files.map((file) => fs.writeFile(path.join(databaseDir, file), backup[file], "utf-8")),
  );
});

describe("shop API", () => {
  test("returns localized products through session locale", async () => {
    const agent = request.agent(app);

    await agent.post("/api/session/locale").send({ locale: "en" }).expect(200);
    const response = await agent.get("/api/products").expect(200);

    expect(response.body[0]).toMatchObject({
      id: 1,
      name: "Cupcakes",
      recommended: false,
    });
  });

  test("stores recommendation tags after product like", async () => {
    const agent = request.agent(app);

    await agent.post("/api/products/1/like").expect(200);
    const response = await agent.get("/api/products").expect(200);

    expect(response.body.some((product) => product.recommended)).toBe(true);
  });

  test("rejects review from guest and accepts review from logged user", async () => {
    const guest = request.agent(app);
    await guest.post("/api/products/1/reviews").send({ rating: 5, comment: "Great" }).expect(401);

    const user = request.agent(app);
    await user.post("/api/auth/login").send({ username: "user", password: "user123" }).expect(200);
    const review = await user
      .post("/api/products/1/reviews")
      .send({ rating: 4, comment: "Fresh and tasty" })
      .expect(201);

    expect(review.body).toMatchObject({ productId: 1, username: "user", rating: 4 });
  });

  test("allows only admin to create and update products", async () => {
    const regularUser = request.agent(app);
    await regularUser.post("/api/auth/login").send({ username: "user", password: "user123" }).expect(200);
    await regularUser.post("/api/admin/products").send({}).expect(403);

    const admin = request.agent(app);
    await admin.post("/api/auth/login").send({ username: "admin", password: "admin123" }).expect(200);
    const created = await admin
      .post("/api/admin/products")
      .send({
        translations: {
          ru: { name: "Макарон", description: "Миндальное печенье" },
          en: { name: "Macaron", description: "Almond cookie" },
        },
        price: 35,
        count: 12,
        image: "cake",
        tags: ["sweet", "almond"],
      })
      .expect(201);

    await admin
      .put(`/api/admin/products/${created.body.id}`)
      .send({ ...created.body, count: 11 })
      .expect(200)
      .expect((response) => {
        expect(response.body.count).toBe(11);
      });
  });

  test("clears authenticated session after logout", async () => {
    const agent = request.agent(app);

    await agent.post("/api/auth/login").send({ username: "admin", password: "admin123" }).expect(200);
    await agent.post("/api/auth/logout").expect(204);
    await agent.get("/api/auth/me").expect(200).expect((response) => {
      expect(response.body.authenticated).toBe(false);
    });
  });
});

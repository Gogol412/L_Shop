import cors from "cors";
import express from "express";
import adminRoute from "./routes/admin.route.js";
import authRoute from "./routes/auth.route.js";
import productsRoute from "./routes/products.route.js";
import sessionRoute from "./routes/session.route.js";
import { sessionMiddleware } from "./middleware/session.js";

export const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(sessionMiddleware);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoute);
app.use("/api/session", sessionRoute);
app.use("/api/products", productsRoute);
app.use("/api/admin", adminRoute);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api/products`);
  });
}

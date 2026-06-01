import { Request, Response, Router } from "express";
import { localizeProduct } from "../lib/localization.js";
import { addRecommendedTags, buildProductFeed } from "../lib/recommendations.js";
import { averageRating, reviewsForProduct } from "../lib/ratings.js";
import { nextId, readProducts, readReviews, writeProducts, writeReviews } from "../lib/storage.js";

const router = Router();

function requireAuth(req: Request, res: Response): boolean {
  if (req.appSession.role === "guest" || !req.appSession.userId || !req.appSession.username) {
    res.status(401).json({ message: "Login is required" });
    return false;
  }

  return true;
}

router.get("/", async (req, res) => {
  const [products, reviews] = await Promise.all([readProducts(), readReviews()]);
  const feed = buildProductFeed(products, reviews, req.appSession);
  res.json(feed);
});

router.get("/:id", async (req, res) => {
  const productId = Number(req.params.id);
  const [products, reviews] = await Promise.all([readProducts(), readReviews()]);
  const product = products.find((item) => item.id === productId);

  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  const productReviews = reviewsForProduct(reviews, productId);
  const localized = localizeProduct(product, req.appSession.locale ?? "ru");

  res.json({
    id: product.id,
    name: localized.name,
    description: localized.description,
    price: product.price,
    count: product.count,
    image: product.image,
    averageRating: averageRating(productReviews),
    reviews: productReviews,
  });
});

router.post("/:id/like", async (req, res) => {
  const productId = Number(req.params.id);
  const products = await readProducts();
  const product = products.find((item) => item.id === productId);

  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  req.appSession.recommendationTags = addRecommendedTags(req.appSession.recommendationTags, product);
  res.json({ tags: Object.keys(req.appSession.recommendationTags) });
});

router.post("/:id/reviews", async (req, res) => {
  if (!requireAuth(req, res)) {
    return;
  }

  const productId = Number(req.params.id);
  const { rating, comment } = req.body as { rating?: number; comment?: string };
  const validatedRating = Number(rating);

  if (!Number.isInteger(validatedRating) || validatedRating < 1 || validatedRating > 5 || !comment?.trim()) {
    res.status(400).json({ message: "Rating from 1 to 5 and comment are required" });
    return;
  }

  const products = await readProducts();
  if (!products.some((product) => product.id === productId)) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  const reviews = await readReviews();
  const review = {
    id: nextId(reviews),
    productId,
    userId: req.appSession.userId!,
    username: req.appSession.username!,
    rating: validatedRating,
    comment: comment.trim(),
    createdAt: new Date().toISOString(),
  };

  reviews.push(review);
  await writeReviews(reviews);
  res.status(201).json(review);
});

export default router;

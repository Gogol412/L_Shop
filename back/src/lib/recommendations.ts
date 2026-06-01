import { AppSession, Product, PublicProduct, RecommendationTag, Review } from "../types.js";
import { localizeProduct } from "./localization.js";
import { averageRating, reviewsForProduct } from "./ratings.js";

const RECOMMENDATION_TTL_MS = 3 * 24 * 60 * 60 * 1000;

export function addRecommendedTags(
  currentTags: Record<string, RecommendationTag>,
  product: Product,
  now = new Date(),
): Record<string, RecommendationTag> {
  const updatedTags = decayRecommendedTags(currentTags, now);

  for (const tag of product.tags) {
    const current = updatedTags[tag];
    updatedTags[tag] = {
      score: (current?.score ?? 0) + 2,
      lastLikedAt: now.toISOString(),
    };
  }

  return updatedTags;
}

export function decayRecommendedTags(
  currentTags: Record<string, RecommendationTag>,
  now = new Date(),
): Record<string, RecommendationTag> {
  const result: Record<string, RecommendationTag> = {};

  for (const [tag, value] of Object.entries(currentTags)) {
    const age = now.getTime() - new Date(value.lastLikedAt).getTime();

    if (age <= RECOMMENDATION_TTL_MS) {
      result[tag] = value;
      continue;
    }

    const decayedScore = Math.max(0, value.score - 1);
    if (decayedScore > 0) {
      result[tag] = { ...value, score: decayedScore };
    }
  }

  return result;
}

export function recommendationScore(
  product: Product,
  currentTags: Record<string, RecommendationTag>,
): number {
  return product.tags.reduce((score, tag) => score + (currentTags[tag]?.score ?? 0), 0);
}

export function buildProductFeed(
  products: Product[],
  reviews: Review[],
  session: AppSession,
): PublicProduct[] {
  const locale = session.locale ?? "ru";
  const activeTags = decayRecommendedTags(session.recommendationTags);
  const decorated = products.map((product) => {
    const localized = localizeProduct(product, locale);
    const productReviews = reviewsForProduct(reviews, product.id);
    const score = recommendationScore(product, activeTags);

    return {
      id: product.id,
      name: localized.name,
      description: localized.description,
      price: product.price,
      count: product.count,
      image: product.image,
      averageRating: averageRating(productReviews),
      reviewsCount: productReviews.length,
      recommended: score > 0,
      score,
    };
  });

  const recommended = decorated
    .filter((product) => product.score > 0)
    .sort((first, second) => second.score - first.score);
  const regular = decorated.filter((product) => product.score === 0);
  const feed: typeof decorated = [];

  while (recommended.length > 0 || regular.length > 0) {
    if (regular.length > 0) {
      feed.push(regular.shift()!);
    }

    if (recommended.length > 0) {
      feed.push(recommended.shift()!);
    }

    if (regular.length > 0) {
      feed.push(regular.shift()!);
    }
  }

  return feed.map(({ score: _score, ...product }) => product);
}

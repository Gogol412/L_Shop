import { addRecommendedTags, decayRecommendedTags, recommendationScore } from "../build/lib/recommendations.js";
import { averageRating } from "../build/lib/ratings.js";
import { localizeProduct, normalizeLocale } from "../build/lib/localization.js";

const product = {
  id: 1,
  translations: {
    ru: { name: "Капкейки", description: "Описание" },
    en: { name: "Cupcakes", description: "Description" },
  },
  price: 50,
  count: 8,
  image: "cupcake",
  tags: ["sweet", "cream"],
};

describe("utility functions", () => {
  test("calculates rounded average rating", () => {
    expect(
      averageRating([
        { rating: 5, productId: 1, id: 1, userId: 1, username: "a", comment: "", createdAt: "" },
        { rating: 4, productId: 1, id: 2, userId: 2, username: "b", comment: "", createdAt: "" },
      ]),
    ).toBe(4.5);
  });

  test("normalizes locale and falls back to Russian product text", () => {
    expect(normalizeLocale("en")).toBe("en");
    expect(normalizeLocale("de")).toBe("ru");
    expect(localizeProduct(product, "en").name).toBe("Cupcakes");
  });

  test("adds product tags and scores recommendations", () => {
    const tags = addRecommendedTags({}, product, new Date("2026-06-01T10:00:00.000Z"));

    expect(Object.keys(tags)).toEqual(["sweet", "cream"]);
    expect(recommendationScore(product, tags)).toBe(4);
  });

  test("decays old recommendation tags", () => {
    const tags = {
      sweet: { score: 1, lastLikedAt: "2026-05-20T10:00:00.000Z" },
      cream: { score: 3, lastLikedAt: "2026-05-31T10:00:00.000Z" },
    };

    expect(decayRecommendedTags(tags, new Date("2026-06-01T10:00:00.000Z"))).toEqual({
      cream: tags.cream,
    });
  });
});

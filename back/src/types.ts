export type Locale = "ru" | "en";

export type UserRole = "user" | "admin";

export interface ProductTranslation {
  name: string;
  description: string;
}

export interface Product {
  id: number;
  translations: Record<Locale, ProductTranslation>;
  price: number;
  count: number;
  image: string;
  tags: string[];
}

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  role: UserRole;
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface RecommendationTag {
  score: number;
  lastLikedAt: string;
}

export interface AppSession {
  id: string;
  locale?: Locale;
  userId?: number;
  username?: string;
  role: "guest" | UserRole;
  recommendationTags: Record<string, RecommendationTag>;
  createdAt: number;
  lastAccessedAt: number;
  adminLoggedAt?: number;
}

export interface StoreData {
  products: Product[];
  users: User[];
  reviews: Review[];
}

export interface PublicProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  count: number;
  image: string;
  averageRating: number;
  reviewsCount: number;
  recommended: boolean;
}

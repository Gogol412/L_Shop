import { Locale, Product, ProductTranslation } from "../types.js";

export const locales: Locale[] = ["ru", "en"];

export function normalizeLocale(locale: unknown): Locale {
  return locale === "en" ? "en" : "ru";
}

export function localizeProduct(product: Product, locale: Locale): ProductTranslation {
  return product.translations[locale] ?? product.translations.ru;
}

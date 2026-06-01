export const locales = ["ru", "en"];
export function normalizeLocale(locale) {
    return locale === "en" ? "en" : "ru";
}
export function localizeProduct(product, locale) {
    return product.translations[locale] ?? product.translations.ru;
}
//# sourceMappingURL=localization.js.map
import { translations } from "./locales";

test("contains Russian and English interface locales", () => {
  expect(translations.ru.catalogTitle).toBe("Подборка для вас");
  expect(translations.en.catalogTitle).toBe("Picked for you");
});

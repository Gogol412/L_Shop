import { Router } from "express";
import { normalizeLocale } from "../lib/localization.js";
const router = Router();
router.get("/locale", (req, res) => {
    res.json({ locale: req.appSession.locale ?? "ru" });
});
router.post("/locale", (req, res) => {
    const { locale } = req.body;
    req.appSession.locale = normalizeLocale(locale);
    res.json({ locale: req.appSession.locale });
});
export default router;
//# sourceMappingURL=session.route.js.map
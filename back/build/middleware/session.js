import crypto from "crypto";
const SESSION_COOKIE = "shop_session";
const ADMIN_TTL_MS = 30 * 60 * 1000;
const sessions = new Map();
function parseCookies(cookieHeader = "") {
    return cookieHeader.split(";").reduce((cookies, chunk) => {
        const [name, ...valueParts] = chunk.trim().split("=");
        if (!name || valueParts.length === 0) {
            return cookies;
        }
        cookies[name] = decodeURIComponent(valueParts.join("="));
        return cookies;
    }, {});
}
function createSession() {
    const now = Date.now();
    return {
        id: crypto.randomUUID(),
        role: "guest",
        recommendationTags: {},
        createdAt: now,
        lastAccessedAt: now,
    };
}
function cookieOptions() {
    return {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
    };
}
export function sessionMiddleware(req, res, next) {
    const cookies = parseCookies(req.headers.cookie);
    const sessionId = cookies[SESSION_COOKIE];
    let session = sessionId ? sessions.get(sessionId) : undefined;
    if (!session) {
        session = createSession();
        sessions.set(session.id, session);
    }
    session.lastAccessedAt = Date.now();
    if (session.role === "admin" && session.adminLoggedAt) {
        const adminAge = Date.now() - session.adminLoggedAt;
        if (adminAge > ADMIN_TTL_MS) {
            session.userId = undefined;
            session.username = undefined;
            session.role = "guest";
            session.adminLoggedAt = undefined;
        }
    }
    req.appSession = session;
    res.cookie(SESSION_COOKIE, session.id, cookieOptions());
    next();
}
export function clearCurrentSession(req, res) {
    sessions.delete(req.appSession.id);
    res.clearCookie(SESSION_COOKIE, cookieOptions());
}
export function resetSessionsForTests() {
    sessions.clear();
}
//# sourceMappingURL=session.js.map
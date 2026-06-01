import { Router } from "express";
import { hashPassword, verifyPassword } from "../lib/passwords.js";
import { nextId, readUsers, writeUsers } from "../lib/storage.js";
import { clearCurrentSession } from "../middleware/session.js";
const router = Router();
router.get("/me", (req, res) => {
    res.json({
        authenticated: req.appSession.role !== "guest",
        user: req.appSession.userId
            ? {
                id: req.appSession.userId,
                username: req.appSession.username,
                role: req.appSession.role,
            }
            : null,
    });
});
router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password || password.length < 4) {
        res.status(400).json({ message: "Username and password with at least 4 characters are required" });
        return;
    }
    const users = await readUsers();
    const normalizedUsername = username.trim().toLowerCase();
    if (users.some((user) => user.username.toLowerCase() === normalizedUsername)) {
        res.status(409).json({ message: "User already exists" });
        return;
    }
    const user = {
        id: nextId(users),
        username: username.trim(),
        passwordHash: hashPassword(password),
        role: "user",
    };
    users.push(user);
    await writeUsers(users);
    req.appSession.userId = user.id;
    req.appSession.username = user.username;
    req.appSession.role = user.role;
    req.appSession.adminLoggedAt = undefined;
    res.status(201).json({ id: user.id, username: user.username, role: user.role });
});
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: "Username and password are required" });
        return;
    }
    const users = await readUsers();
    const user = users.find((item) => item.username.toLowerCase() === username.trim().toLowerCase());
    if (!user || !verifyPassword(password, user.passwordHash)) {
        res.status(401).json({ message: "Invalid username or password" });
        return;
    }
    req.appSession.userId = user.id;
    req.appSession.username = user.username;
    req.appSession.role = user.role;
    req.appSession.adminLoggedAt = user.role === "admin" ? Date.now() : undefined;
    res.json({ id: user.id, username: user.username, role: user.role });
});
router.post("/logout", (req, res) => {
    clearCurrentSession(req, res);
    res.status(204).send();
});
export default router;
//# sourceMappingURL=auth.route.js.map
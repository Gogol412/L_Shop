import crypto from "crypto";
export function hashPassword(password, salt = crypto.randomUUID()) {
    const digest = crypto.createHash("sha256").update(`${salt}:${password}`).digest("hex");
    return `sha256:${salt}:${digest}`;
}
export function verifyPassword(password, passwordHash) {
    const [algorithm, salt, expectedDigest] = passwordHash.split(":");
    if (algorithm !== "sha256" || !salt || !expectedDigest) {
        return false;
    }
    const actualDigest = crypto.createHash("sha256").update(`${salt}:${password}`).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(actualDigest), Buffer.from(expectedDigest));
}
//# sourceMappingURL=passwords.js.map
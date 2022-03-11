"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRefreshToken = exports.createToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const createToken = (type, user) => (0, jsonwebtoken_1.sign)(Object.assign({ userId: user.id }, (type === "refreshToken" ? { tokenVersion: user.tokenVersion } : {})), type === "accessToken"
    ? process.env.ACCESS_TOKEN_SECRET
    : process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: type === "accessToken" ? "15s" : "60m",
});
exports.createToken = createToken;
const sendRefreshToken = (res, user) => {
    res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME, (0, exports.createToken)("refreshToken", user), {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/refresh_token",
    });
};
exports.sendRefreshToken = sendRefreshToken;
//# sourceMappingURL=auth.js.map
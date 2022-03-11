"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const express_1 = __importDefault(require("express"));
const User_1 = require("../entities/User");
const auth_1 = require("../utils/auth");
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    const refreshToken = req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME];
    if (!refreshToken)
        return res.sendStatus(401);
    try {
        const decodedUser = (0, jsonwebtoken_1.verify)(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const existingUser = await User_1.User.findOne(decodedUser.userId);
        if (!existingUser ||
            existingUser.tokenVersion !== decodedUser.tokenVersion) {
            return res.sendStatus(401);
        }
        (0, auth_1.sendRefreshToken)(res, existingUser);
        return res.json({
            success: true,
            accessToken: (0, auth_1.createToken)("accessToken", existingUser),
        });
    }
    catch (error) {
        console.log("ERROR REFRESHING TOKEN", error);
        return res.sendStatus(403);
    }
});
exports.default = router;
//# sourceMappingURL=refreshTokenRouter.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const RegisterInput_1 = require("../types/RegisterInput");
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entities/User");
const argon2_1 = __importDefault(require("argon2"));
const UserMutationResponse_1 = require("./UserMutationResponse");
const LoginInput_1 = require("../types/LoginInput");
const auth_1 = require("../utils/auth");
let UserResolver = class UserResolver {
    async users() {
        return await User_1.User.find();
    }
    async register(registerInput) {
        const { username, password } = registerInput;
        const existingUser = await User_1.User.findOne({ username });
        if (existingUser) {
            return {
                code: 400,
                success: false,
                message: "Duplicated username",
            };
        }
        const hashedPassword = await argon2_1.default.hash(password);
        const newUser = User_1.User.create({
            username,
            password: hashedPassword,
        });
        await newUser.save();
        return {
            code: 400,
            success: false,
            message: "User registration successful",
            user: newUser,
        };
    }
    async login({ username, password }, { res }) {
        const existingUser = await User_1.User.findOne({ username });
        if (!existingUser) {
            return {
                code: 400,
                success: false,
                message: "User not found",
            };
        }
        const isPasswordValid = await argon2_1.default.verify(existingUser.password, password);
        if (!isPasswordValid) {
            return {
                code: 400,
                success: false,
                message: "Incorrect password",
            };
        }
        (0, auth_1.sendRefreshToken)(res, existingUser);
        return {
            code: 200,
            success: true,
            message: "Logged in successfully",
            user: existingUser,
            accessToken: (0, auth_1.createToken)("accessToken", existingUser),
        };
    }
    async logout(userId, { res }) {
        const existingUser = await User_1.User.findOne(userId);
        if (!existingUser) {
            return {
                code: 400,
                success: false
            };
        }
        existingUser.tokenVersion += 1;
        await existingUser.save();
        res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/refresh_token'
        });
        return { code: 200, success: true };
    }
};
__decorate([
    (0, type_graphql_1.Query)((_return) => [User_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => UserMutationResponse_1.UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("registerInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterInput_1.RegisterInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => UserMutationResponse_1.UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("loginInput")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginInput_1.LoginInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(_return => UserMutationResponse_1.UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)('userId', _type => type_graphql_1.ID)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map
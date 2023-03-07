"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_client_1 = __importDefault(require("../utils/prisma-client"));
const UserBody = zod_1.z.object({
    username: zod_1.z.string().regex(/^[a-zA-Z0-9_]+$/g),
    email: zod_1.z.string().email(),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    password: zod_1.z.string(),
});
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = UserBody.safeParse(req.body);
    if (!result.success)
        return next(result.error);
    const password = yield bcrypt_1.default.hash(result.data.password, 10);
    const user = yield prisma_client_1.default.user.create({
        data: Object.assign(Object.assign({}, result.data), { password }),
        select: {
            id: true,
            username: true,
            email: true,
        },
    });
    return res.status(201).json(user);
});
exports.registerUser = registerUser;

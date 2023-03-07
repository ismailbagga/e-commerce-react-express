"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = exports.productRouter = void 0;
const express_1 = __importDefault(require("express"));
const ProductController_1 = require("../controllers/ProductController");
const UserController_1 = require("../controllers/UserController");
exports.productRouter = express_1.default.Router();
exports.productRouter.get("", ProductController_1.getProducts);
exports.productRouter.post("", ProductController_1.saveProduct);
exports.userRouter = express_1.default.Router();
exports.userRouter.post("/register", UserController_1.registerUser);

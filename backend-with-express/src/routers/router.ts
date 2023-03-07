import express from "express";
import { saveProduct, getProducts } from "../controllers/ProductController";
import { registerUser } from "../controllers/UserController";
export const productRouter = express.Router();
productRouter.get("", getProducts);
productRouter.post("", saveProduct);

export const userRouter = express.Router();
userRouter.post("/register", registerUser);

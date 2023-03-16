import {
  getHomePageProducts,
  searchForProducts,
} from "./../controllers/ProductController";
import express from "express";
import { saveProduct } from "../controllers/ProductController";
import { registerUser } from "../controllers/UserController";

export const productRouter = express.Router();

productRouter.get("/search", searchForProducts);
productRouter.get("/home", getHomePageProducts);

productRouter.post("", saveProduct);

export const userRouter = express.Router();
userRouter.post("/register", registerUser);

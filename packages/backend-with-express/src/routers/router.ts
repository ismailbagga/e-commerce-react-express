import {
  getHomePageProducts,
  searchForProducts,
} from "./../controllers/ProductController";
import express from "express";
import { saveProduct } from "../controllers/ProductController";
import { registerUser } from "../controllers/UserController";
import { createCategory } from "../controllers/CategoryController";

export const productRouter = express.Router();

productRouter.get("/search", searchForProducts);
productRouter.get("/home", getHomePageProducts);

productRouter.post("", saveProduct);

export const userRouter = express.Router();
userRouter.post("/register", registerUser);

export const categoryRouter = express.Router();
categoryRouter.post("/", createCategory);

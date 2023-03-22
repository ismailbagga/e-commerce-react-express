import { imageTypeValidator } from "./utils/core-utils";
import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import { z } from "zod";
import { categoryRouter, productRouter, userRouter } from "./routers/router";
import { fromZodError } from "zod-validation-error";
import { Prisma } from "@prisma/client";
import cors from "cors";
import ApiError from "./controllers/ApiError";
import multer, { FileFilterCallback, MulterError } from "multer";

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "dist/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + "-" + file.originalname);
  },
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(
  multer({
    storage: fileStorage,
    fileFilter: imageTypeValidator(50, ["image/png", "image/jpeg"]),
    limits: { fileSize: 2 * 1024 * 1024 },
  }).single("image")
);
app.use("/api/products", productRouter);
app.use("/api/user", userRouter);
app.use("/api/categories", categoryRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  if (err instanceof MulterError) {
    return res.status(400).json({ message: err.message });
  }
  if (err instanceof ApiError)
    return res.status(err.status).json({ message: err.message });

  if (err instanceof Prisma.PrismaClientKnownRequestError)
    return res
      .status(400)
      .json({ message: "something went wrong saving data try again" });

  if (err instanceof z.ZodError) {
    let { message } = fromZodError(err);
    message = message.replace(/"/g, "'");
    return res.status(416).json({ message });
  }
  res.status(400).json({ message: "Ops Something Went Wrong !" });
});

app.listen(4000, () => {
  console.log(
    "---------------------------------------- Server start ---------------------------------------------------"
  );
});
